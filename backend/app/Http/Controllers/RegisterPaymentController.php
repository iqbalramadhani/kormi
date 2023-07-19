<?php

namespace App\Http\Controllers;

use App\Admin;
use App\Event;
use App\Library\ExportExcel;
use App\Library\Response;
use App\RegisterPayment;
use App\Setting;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Lumen\Routing\Controller as BaseController;

class RegisterPaymentController extends BaseController
{
    public function index(Request $request)
    {
        $admin = Admin::find($request->auth->id);
        $perPage = env('TOTAL_PER_PAGE', 20);
        if ($request->limit) {
            $perPage = $request->limit;
        }

        $startDate = $request->get("start_date");
        $endDate = $request->get("end_date");

        $query = RegisterPayment::where('order_id', 'like', 'ADMRGS-'.$admin->id.'%')
            ->whereHas('user', function($q) use ($request, $admin, $startDate, $endDate){
                if($request->auth->identity == 'admin')
                {
                    if($admin->role >= 1 && $admin->role < 7)
                    {
                        $q->where('organitation_parent_id', $admin->organitation_parent_id);

                        if($admin->role >= 2)
                            $q->where('provinces_id', $admin->provinces_id);

                        if($admin->role >= 3)
                            $q->where('cities_id', $admin->cities_id);
                    }
                }
            })
            ->select('invoice_id', 'order_id', 'status', 'expired', DB::raw("count(*) total"), 'created_at');

        $keyword = (isset($request->search) && !empty($request->search)) ? $request->search : '';
        if (!empty($keyword)) {
            $query = $query->where('register_payment.invoice_id', 'Like', '%'.$keyword.'%')
                ->orWhere('register_payment.status', 'Like', '%'.$keyword.'%')
                ->orWhere('register_payment.expired', 'Like', '%'.$keyword.'%');
        }
        if($startDate)
            $query = $query->where('created_at', ">=", $startDate);

        if($endDate) {
            $query = $query->where('created_at', "<=", $endDate);
        }
//        dd($startDate, $endDate);

        $query->groupBy('invoice_id', 'order_id', 'status', 'expired', 'created_at');
        $data = $query->orderBy('created_at', 'DESC')->paginate($perPage);

        $data->getCollection()->transform(function ($item, $key) {
            $payment_link = '';
            $status = $item->status;
            $datetime_now = date('Y-m-d H:i:s');
            if ($item->status == 'PENDING' || $item->status == 'UNPAID') {
                if ($datetime_now > $item->expired) {
                    $status = 'EXPIRED';
                }
            }
            $users = [];
            if ($status == 'PENDING') {
                $users = RegisterPayment::leftJoin("users","register_payment.user_id","users.id")->where('order_id', $item->order_id)
                    ->select('users.*')->get();
                $payment_link = env('LINK_INVOICE').'/payment/method/'.$item->invoice_id;
            }
            $setting = Setting::first();
            return [
                'datetime_now' => $datetime_now,
                'invoice_id' => $item->invoice_id,
                'order_id' => $item->order_id,
                'status' => $status,
                'users' => $users ?? [],
                'total_price' => ($item->total * $setting->register_price),
                'expired' => $item->expired,
                'created_at' => $item->created_at->toDateTimeString(),
                'payment_link' => $payment_link,
            ];
        });

        if ($data->count() > 0) {
            return Response::api('Success', $data);
        }

        return Response::api('Empty Data', $data);
    }

    public function detail(Request $request, $id)
    {
        $admin = Admin::with(['province', 'city'])->where('id', $request->auth->id)->first();

        $payments = RegisterPayment::where('order_id', $id)->get();
        $setting = Setting::first();
        $user = User::whereIn('id', $payments->pluck('user_id'))->get()
            ->map(function($value) use ($setting){
                return [
                    'email' => $value->email,
                    'name' => $value->name,
                    'price' => $setting->register_price
                ];
            });

        $payment = $payments->first();
        $subTotal = $user ? count($user) * $setting->register_price : 0;
        $data = [
            'invoice_id' => $payment->invoice_id ?? '',
            'admin_name' => $admin->name,
            'admin_role' => $admin->role_text,
            'sub_total' => $subTotal,
            'admin_fee' => 0,
            'grandtotal' => $subTotal,
            'users' => $user,
            'city' => $admin->city->name ?? '',
            'payment_link' => env('LINK_INVOICE').'/payment/method/'.$payment->invoice_id
        ];

        return Response::api("data fetch", $data);
    }

    public function export(Request $request)
    {
        $admin = Admin::find($request->auth->id);
        $startDate = $request->get("start_date");
        $endDate = $request->get("end_date");

        $query = RegisterPayment::where('order_id', 'like', 'ADMRGS-'.$admin->id.'%')
            ->whereHas('user', function($q) use ($request, $admin){
                if($request->auth->identity == 'admin')
                {
                    if($admin->role >= 1 && $admin->role < 7)
                    {
                        $q->where('organitation_parent_id', $admin->organitation_parent_id);

                        if($admin->role >= 2)
                            $q->where('provinces_id', $admin->provinces_id);

                        if($admin->role >= 3)
                            $q->where('cities_id', $admin->cities_id);

                    }
                }
            })
            ->select('invoice_id', 'order_id', 'status', 'expired', DB::raw("count(*) total"), 'created_at');

        if($startDate)
            $query->where('created_at', ">=", $startDate);
        if($endDate)
            $query->where('created_at', "<=", $endDate);

        $query->groupBy('invoice_id', 'order_id', 'status', 'expired');
        $data = $query->orderBy('created_at', 'DESC')->get();

        $data1 = $data->map(function ($item, $key) {
            $payment_link = '';
            $status = $item->status;
            $datetime_now = date('Y-m-d H:i:s');
            if ($item->status == 'PENDING' || $item->status == 'UNPAID') {
                if ($datetime_now > $item->expired) {
                    $status = 'EXPIRED';
                }
            }
            $users = [];
            if ($status == 'PENDING') {
                $users = RegisterPayment::leftJoin("users","register_payment.user_id","users.id")->where('order_id', $item->order_id)
                    ->select('users.*')->get();
                $payment_link = env('LINK_INVOICE').'/payment/method/'.$item->invoice_id;
            }
            $setting = Setting::first();
            return (object) [
                'datetime_now' => $datetime_now,
                'invoice_id' => $item->invoice_id,
                'order_id' => $item->order_id,
                'status' => $status,
                'users' => $users ?? [],
                'total_price' => ($item->total * $setting->register_price),
                'expired' => $item->expired,
                'created_at' => $item->created_at->toDateTimeString(),
                'payment_link' => $payment_link,
            ];
        });

        $header = [
            "INVOICE ID" => 'invoice_id',
            "ORDER ID" => "order_id",
            "STATUS" => "status",
            "TOTAL PRICE" => "total_price",
            "TANGGAL TRANSAKSI" => "created_at",
            "EXPIRED" => "expired",
        ];


        $export = new ExportExcel($header, $data1, "register_payment_" . date("YmdHis"), $path = 'storage/export/register_payment', $ext = 'xlsx');

        $result = $export->export();

        return Response::api('sukses', [
            "file" => $result['url'],
        ]);
    }
}
