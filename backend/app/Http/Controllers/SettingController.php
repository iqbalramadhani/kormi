<?php

namespace App\Http\Controllers;
use App\Setting;
use App\Admin;
use App\User;
use App\Event;
use App\UserToken;
use App\Library\Response;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\RegisterPayment;
use App\Library\Mail;
use App\EventPayment;
use App\JoinEvent;
use App\Library\Asset;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use App\Library\Common;
use Illuminate\Support\Facades\Hash;
use App\PengurusKormi;

class SettingController extends BaseController
{

    public function __construct(Request $request)
    {
        $this->_validation($request);
        $this->model = new Setting();
    }

    private function _validation($request){
        $app_id = isset($request->auth->app_id) ? $request->auth->app_id : "";
        $data = array();

        if(array_key_exists(Response::function(), $data)){
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $request){
        $data = $this->model->first();
        $data->message_invitation_register_list = explode("|",$data->message_invitation_register);
        return Response::api("Success",$data);
    }

    public function getPengurus(Request $request){

        $pengurus = PengurusKormi::all();

        return Response::api("Success",$pengurus);
    }

    public function update(Request $request){
        try {
            $data = $this->model->find(1);
            if($data){
                $data->update($request->all());
                return Response::api('Success Update Data',$data);
            }else{
                return Response::apiEmpty("Not Found Data",null,400);
            }
        } catch (\Exception $e) {
            error_log(print_r($e->getMessage(),true));
            return Response::apiError();
        }
    }

    public function getDashboard(Request $request)
    {
        $admin = Admin::find($request->auth->id);
        $organitation_parent_id = $admin->organitation_parent_id;
        $provinces_id = 0;
        $cities_id = 0;
        switch ($admin->role) {
            case '0': //super admin
                $organitation_parent_id = 0;
                break;
            case '1': //admin national
                break;
            case '2': //admin province
                $provinces_id = $admin->provinces_id;
                break;
            case '3': //admin city
                $cities_id = $admin->cities_id;
                break;
            case '4': //admin olahraga
                break;
            case '5': //admin olahraga daerah
                break;

            default:
                // code...
                break;
        }

        $all_user = User::where(function ($query) use ($organitation_parent_id, $provinces_id, $cities_id) {
            if (!empty($organitation_parent_id)) {
                $query->where('organitation_parent_id', $organitation_parent_id);
            }
            if (!empty($provinces_id)) {
                $query->where('provinces_id', $provinces_id);
            }
            if (!empty($cities_id)) {
                $query->where('cities_id', $cities_id);
            }
        })->count();
        $current_user_count = User::where(function ($query) use ($organitation_parent_id, $provinces_id, $cities_id) {
            if (!empty($organitation_parent_id)) {
                $query->where('organitation_parent_id', $organitation_parent_id);
            }
            if (!empty($provinces_id)) {
                $query->where('provinces_id', $provinces_id);
            }
            if (!empty($cities_id)) {
                $query->where('cities_id', $cities_id);
            }
        })->whereDate("created_at",date("Y-m-d"))->count();
        $admin_login = UserToken::select("user_token.updated_at","users.name")->join("users","user_token.user_id","=","users.id")
            ->limit(20)->orderBy("user_token.updated_at","DESC")->where(function ($query) use ($organitation_parent_id, $provinces_id, $cities_id) {
                if (!empty($organitation_parent_id)) {
                    $query->where('users.organitation_parent_id', $organitation_parent_id);
                }
                if (!empty($provinces_id)) {
                    $query->where('users.provinces_id', $provinces_id);
                }
                if (!empty($cities_id)) {
                    $query->where('users.cities_id', $cities_id);
                }
            })->get();
        $active_user = User::where("status",1)->where(function ($query) use ($organitation_parent_id, $provinces_id, $cities_id) {
            if (!empty($organitation_parent_id)) {
                $query->where('organitation_parent_id', $organitation_parent_id);
            }
            if (!empty($provinces_id)) {
                $query->where('provinces_id', $provinces_id);
            }
            if (!empty($cities_id)) {
                $query->where('cities_id', $cities_id);
            }
        })->count();


        $app_current_month = User::whereYear("created_at",date("Y"))->where(function ($query) use ($organitation_parent_id, $provinces_id, $cities_id) {
            if (!empty($organitation_parent_id)) {
                $query->where('organitation_parent_id', $organitation_parent_id);
            }
            if (!empty($provinces_id)) {
                $query->where('provinces_id', $provinces_id);
            }
            if (!empty($cities_id)) {
                $query->where('cities_id', $cities_id);
            }
        })->whereMonth("created_at",date("m"))->count();

        $last_login = [];

        foreach ($admin_login as $key => $value) {
            $date1=date_create($value->updated_at);
            $date2=date_create();

            $diff  = date_diff( $date1, $date2 );

            $time = "terakhir aktif pada ".$value->updated_at;
            if($diff->y < 1 && $diff->m < 1 && $diff->d < 1 && $diff->h < 1 && $diff->i < 1 && $diff->s < 30){
                $time = "aktif beberapa saat yang lalu";
            }
            if($diff->y < 1 && $diff->m < 1 && $diff->d < 1 && $diff->h < 1 && $diff->i < 1 && $diff->s >= 30){
                $time = "aktif ".$diff->s." detik yang lalu";
            }
            if($diff->y < 1 && $diff->m < 1 && $diff->d < 1 && $diff->h < 1 && $diff->i >= 1){
                $time = "aktif ".$diff->i." menit ".$diff->s." detik yang lalu";
            }
            if($diff->y < 1 && $diff->m < 1 && $diff->d < 1 && $diff->h >= 1){
                $time = "aktif ".$diff->h." jam yang lalu";
            }
            if($diff->y < 1 && $diff->m < 1 && $diff->d >= 1){
                $time = "aktif ".$diff->d." hari yang lalu";
            }
            if($diff->y < 1 && $diff->m >= 1){
                $time = "aktif ".$diff->m." bulan yang lalu";
            }
            $last_login[] = array(
                "pesantren" => $value->name,
                "time" => $time,
            );
        }

        $duration = strtolower($request->get('analytic_duration')) ?? 'y';


        $formatLabel = 'd M Y';
        $formatSQL = '%Y%m%d';
        $keyArray = 'Ymd'; // harusa sama denag format tanggal mysql
        switch ($duration) {
            case 'm':
                $limitDate = Carbon::now()->subMonth();
                break;
            case 'w':
                $limitDate = Carbon::now()->subWeek()->addDay();
                break;
            default:
                $formatLabel = 'M y';
                $formatSQL = '%Y%m';
                $keyArray = 'Ym';
                $limitDate = Carbon::now()->subYear()->addMonth();
                break;
        }

        $count_per_mounth =  User::select(DB::raw("count(*) as count,DATE_FORMAT(created_at, '{$formatSQL}') as month_year"))
            ->where(function ($query) use ($organitation_parent_id, $provinces_id, $cities_id) {
                if (!empty($organitation_parent_id)) {
                    $query->where('organitation_parent_id', $organitation_parent_id);
                }
                if (!empty($provinces_id)) {
                    $query->where('provinces_id', $provinces_id);
                }
                if (!empty($cities_id)) {
                    $query->where('cities_id', $cities_id);
                }
            })
            ->where('created_at', '>=', $limitDate->startOfDay())
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '{$formatSQL}')"))
            ->orderBy('created_at', 'asc')
            ->get()
            ->pluck('count', 'month_year');

//        $data_per_month=[];

//        $month = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Des"];
//        foreach ($count_per_mounth as $key => $value) {
//            $data_per_month[$value->month] = $value->count;
//        }

        $labels = [];
        $data_pesantren = [];
        $background_data_pesantren = [];

        do{
            $labels[] = $limitDate->format($formatLabel);
            $data_pesantren[]= $count_per_mounth[$limitDate->format($keyArray)] ?? 0;
            $background_data_pesantren[]="#4770FF";
            if($duration != 'y' && !empty($duration))
                $limitDate->addDay();
            else
                $limitDate->addMonth();

        } while($limitDate <= Carbon::now()->startOfDay());
//        for ($i=0; $i < 12 ; $i++) {
//            $labels[]=$month[$i];
//            $data_pesantren[]=isset($data_per_month[$i+1]) ? $data_per_month[$i+1] : 0;
//            $background_data_pesantren[]="#4770FF";
//        }

        $chart = array(
            "labels" => $labels,
            "datasets" => array(
                array(
                    "label" => "Member",
                    "data" => $data_pesantren,
                    "backgroundColor" => $background_data_pesantren
                ),
            ),
        );
        $res = array(
            "current_user_count" => $current_user_count,
            "all_user" => $all_user,
            "active_user" => $active_user,
            "app_current_month" => $app_current_month,
            "chart_app_per_month" => $chart,
            "last_login" => $last_login,
            "chart_data" => $data_pesantren,
            "chart_labels" => $labels,
        );

        return Response::api("Success Load",$res);
    }

    public function paymentNotif(Request $request)
    {
        set_time_limit(20);
        $notif_type = \explode("-",$request->orderId);
        if($notif_type[0] == "REGISTER"){
            $payment = RegisterPayment::where("order_id", $request->orderId)->first();
            $status = "FAILED";
            if ($payment && $request->merchantId == env("MARCHANT_ID")) {
                $status = "Success";
                $payment->update(["status" => $request->status]);
                if ($request->status == "PAID") {
                    $user = User::find($payment->user_id);
                    $user->update(["status" => 2]);
                    if(!empty($user->email)){
                        $sendMail = Mail::to($user->email)
                            ->template('email.register_success', ["user" => $user])
                            ->subject("Pendaftaran Berhasil")
                            ->Send();
                    }
                }
            }

            $response = array(
                "status" => $status,
                "message" => $status,
                "invoiceId" => $request->invoiceId,
            );
            return response()->json($response, 200);
        }

        if($notif_type[0] == "ADMRGS"){
            $payments = RegisterPayment::where("order_id", $request->orderId)->get();
            $status = "FAILED";
            foreach ($payments as $key => $payment) {
                if ($payment && $request->merchantId == env("MARCHANT_ID")) {
                    $status = "Success";
                    $payment->update(["status" => $request->status]);
                    if ($request->status == "PAID") {
                        $user = User::find($payment->user_id);
                        if($user && $user->status == 0){
                            $no_member = User::createNoMember($user->id, $user->cities_id);
                            $update = ["member_number" => $no_member,"status" => 1];
                            if(!empty($user->email)){
                                $password = Common::generateRandomString();
                                $sendMail = Mail::to($user->email)
                                ->template('email.register_success_by_admin', ["user" => $user,"password" => $password])
                                ->subject("Pendaftaran Berhasil")
                                ->Send();
                                $update["password"] = Hash::make($password);
                            }
                            $user->update($update);
                        }
                    }
                }
            }

            $response = array(
                "status" => $status,
                "message" => $status,
                "invoiceId" => $request->invoiceId,
            );
            return response()->json($response, 200);
        }

        if($notif_type[0] == "EVENT"){
            $payment = EventPayment::where("order_id", $request->orderId)->first();
            $status = "FAILED";
            if ($payment && $request->merchantId == env("MARCHANT_ID")) {
                $status = "Success";
                $payment->update(["status" => $request->status]);
                if ($request->status == "EXPIRED") {
                    JoinEvent::where("user_id",$payment->user_id)->where("event_id",$payment->event_id)->update(["status" => -1, "no_booking" => null]);
                }
                if ($request->status == "PAID") {
                    $joinEvent = JoinEvent::where("user_id",$payment->user_id)->where("event_id",$payment->event_id)->first();
                    $event = Event::where("id",$payment->event_id)->first();
                    $user = User::find($payment->user_id);
                    $sendMail = Mail::to($user->email)
                        ->template('email.booking_event', ["event"=>$event,"user" => $user])
                        ->subject("Event Berhasil Di Booking")
                        ->Send();

                    $countJoin = JoinEvent::where("status",1)->where("event_id",$payment->event_id)->count();
                    $urut = $countJoin + 1;

                    $no_booking = JoinEvent::createNoBooking($payment->event_id,$urut);
                    JoinEvent::where("user_id",$payment->user_id)->where("event_id",$payment->event_id)->update(["status" => 1, "no_booking" => $no_booking]);
                }
            }

            $response = array(
                "status" => $status,
                "message" => $status,
                "invoiceId" => $request->invoiceId,
            );
            return response()->json($response, 200);
        }
    }
}
