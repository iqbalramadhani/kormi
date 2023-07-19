<?php

namespace App\Http\Controllers;

use App\Admin;
use App\Cities;
use App\District;
use App\Jobs\ReportUserJob;
use App\JoinAdmin;
use App\JoinEvent;
use App\Library\Asset;
use App\Library\Common;
use App\Library\Curl;
use App\Library\ExcelStringBinder;
use App\Library\ExportExcel;
use App\Library\Mail;
use App\Library\Response;
use App\Library\SmsOtp;
use App\MasterOrganitationParent;
use App\MasterOrganitationStatus;
use App\Otp;
use App\Province;
use App\RegisterPayment;
use App\Setting;
use App\User;
use App\Village;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Routing\Controller as BaseController;
use Laravolt\Indonesia\Models\City;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends BaseController
{
    public function __construct(Request $request)
    {
        $this->_validation($request);
    }

    private function _validation($request)
    {
        $app_id = isset($request->auth->app_id) ? $request->auth->app_id : '';
        $data = [
            'changePassword' => [
                'password' => 'required|min:8|confirmed',
                'old_password' => 'required|min:6',
            ],
            'profileUpdate' => [
                'name' => 'required',
                'nik' => 'required|digits:16',
                'post_code' => 'numeric|digits_between:1,5',
                'provinces_id' => 'exists:provinces,id',
                'cities_id' => 'exists:cities,id',
                'districts_id' => 'exists:districts,id',
                'villages_id' => 'exists:villages,id',
            ],
            'updateStatus' => [
                'status' => 'in:-1,1',
            ],
            'joinAdmin' => [
                'current_agency' => 'required',
                'organizational_experience' => 'required',
            ],
            'sendOtp' => [
                'to' => 'required',
                'type' => 'required|in:register,forget_password',
            ],
            'create' => [
                'city' => 'required|exists:cities,id',
                'organitation_parent' => 'required',
                'otp' => 'required',
                'name' => 'required',
                'password' => 'required|min:8|confirmed',
            ],
            'roleUpdate' => [
                'role' => 'required',
            ],
            'updatemember' => [
                'id' => 'exists:users,id',
                'cities_id' => 'exists:cities,id',
                'name' => 'required',
            ],
        ];

        if (array_key_exists(Response::function(), $data)) {
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $request)
    {
        $perPage = env('TOTAL_PER_PAGE', 20);
        if ($request->limit) {
            $perPage = $request->limit;
        }
        $search = '%'.$request->search.'%';
        $user = User::where('email', 'like', $search)->orWhere('name', 'like', $search)->paginate($perPage);
        if (!$user) {
            return Response::apiError('Not found data', []);
        }
        return Response::api('Search Success', $user);
    }

    public function exportAll(Request $request)
    {
        ini_set('memory_limit','256M');
        $header = [
            'No. Member' => 'member_number',
            'NIK' => 'nik',
            'NAMA' => 'nama',
            'GENDER' => 'gender',
            'EMAIL' => 'email',
            'NO.TLP' => 'phone_number',
            'PROVINSI' => 'province_name',
            'KOTA' => 'city_name',
            'INDUK OLAHRAGA' => 'organization_parent_name',
            'STATUS ORGANISASI' => 'organization_status_name',
        ];

        $users = User::with(['province', 'city', 'organitationStatus', 'organitationParent'])->get();

        $export = (new ExportExcel(
            $header,
            $users,
            'mandiri_export_' . date("Ymdhis"),
            'storage/export/excel')
        )->export();

        if(!$export['success'])
            return Response::apiError($export['message']);

        return Response::api("export sukses", [
            'url' => $export['url']
        ]);

    }

    public function profileUpdate(Request $request)
    {
        $update = [
            'name' => $request->name,
            // 'email' => $request->email,
            'gender' => $request->gender,
            'nik' => $request->nik ?? '',
            'place_of_birth_text' => $request->place_of_birth_text,
            'phone_number' => $request->phone_number,
            'place_of_birth' => $request->place_of_birth && $request->place_of_birth != 'null' ? $request->place_of_birth : null,
            'provinces_id' => $request->provinces_id && $request->provinces_id != 'null' ? $request->provinces_id : null,
            'cities_id' => $request->cities_id && $request->cities_id != 'null' ? $request->cities_id : null,
            'districts_id' => $request->districts_id && $request->districts_id != 'null' ? $request->districts_id : null,
            'villages_id' => $request->villages_id && $request->villages_id != 'null' ? $request->villages_id : null,
            'address' => $request->address,
            'post_code' => $request->post_code,
            'birth_date' => $request->birth_date && $request->birth_date != 'null' ? $request->birth_date : null,
            'current_agency' => $request->current_agency,
            'organizational_experience' => $request->organizational_experience,
        ];

        $user = User::where('id', $request->auth->id)->first();
        $user->update($update);
        if (!$user) {
            return Response::apiError('Failed Update Profile', []);
        }

        return Response::api('Update Profile Success', $user);
    }

    public function updateStatus($id, Request $request)
    {
        $update = [
            'status' => (int) $request->status,
        ];

        $user = User::where('id', $id)->first();
        if (!$user) {
            return Response::apiError('Failed Update Profile', []);
        }
        if ($user->status == 2 && $request->status == 1) {
            $no_member = User::createNoMember($user->id, $user->cities_id);
            $update['member_number'] = $no_member;
        }
        $user->update($update);

        return Response::api('Update Profile Success', $user);
    }

    public function delete($id, Request $request)
    {
        $user = User::where('id', $id)->first();
        if (!$user) {
            return Response::apiError('Failed User Not Found', []);
        }

        if ($user->status == 1) {
            return Response::apiError('Failed Delete User Active', []);
        }

        $user->delete();

        return Response::api('Delete User Success', true);
    }

    public function roleUpdate($id, Request $request)
    {
        $update = [
            'role' => $request->role,
        ];

        $user = User::where('id', $id)->first();
        $user->update($update);
        if (!$user) {
            return Response::apiError('Failed Update Profile', []);
        }

        return Response::api('Update Profile Success', $user);
    }

    public function avatarUpdate(Request $request)
    {
        $imagePathName = Asset::setPath($request->auth->id, 'avatar', $request->auth->id.'.png');
        $avatar = $request->avatar;
        $avatar = explode(',', $avatar);
        $avatar = Asset::uploadImage($imagePathName, $avatar[1], true);

        $update = [
            'avatar' => $avatar,
        ];

        $user = User::where('id', $request->auth->id)->first();

        $user->update($update);
        if (!$user) {
            return Response::apiError('Failed Update Profile', []);
        }

        return Response::api('Update Profile Success', $user);
    }

    public function detailRegister()
    {
        return Response::api('Success Load Data', ['amount' => (int) env('REGISTER_AMOUNT')]);
    }

    public function joinAdmin(Request $request)
    {
        $update = [
            'current_agency' => $request->current_agency,
            'current_job' => $request->current_job,
            'organizational_experience' => $request->organizational_experience,
        ];
        $user = User::where('id', $request->auth->id)->first();

        $user->update($update);
        if (!$user) {
            return Response::apiError('Failed Update Profile', []);
        }

        $joinAdmin = [
            'user_id' => $request->auth->id,
        ];

        $create = JoinAdmin::updateOrCreate($joinAdmin);

        return Response::api('Permintaan telah dikirm', $create);
    }

    public function sendOtp(Request $req)
    {
        // Validate email
        $to = $req->to;
        $type = $req->type;
        $email = '';
        $phone_number = '';
        if (filter_var($to, FILTER_VALIDATE_EMAIL)) {
            $email = $to;
        } else {
            $phone_number = $to;
        }

        $msg = 'Success';
        $model = new User();
        if (empty($email) && empty($phone_number)) {
            return Response::apiError('Phone number atau email harus di isi', []);
        }

        if ($type == 'forget_password') {
            $user = User::where('email', $to)->orWhere('phone_number', $to)->first();
            if (!$user) {
                return Response::apiError('Akun belum terdaftar', []);
            }
            if ($user->status != 1) {
                return Response::apiError('Akun tidak aktif', []);
            }
        }

        if (!empty($email)) {
            $model = $model->where('email', $email);
        }

        if (!empty($phone_number)) {
            $model = $model->orwhere('phone_number', $phone_number);
        }

        $user = $model->first();
        if ($user) {
            if ($user->status != 0 && $type == 'register') {
                return Response::apiError('User sudah terdaftar', []);
            }
        }
        $code = mt_rand(10000, 99999);

        if (!empty($email)) {
            $subject = 'Otp Pendaftaran';
            if ($type == 'forget_password') {
                $subject = 'Otp Reset Password';
            }
            $email = trim($email);
            Otp::where('to', $email)->where('proccess', 'register')->delete();
            Otp::create(['to' => $email, 'proccess' => $type, 'otp' => $code]);
            $sendMail = Mail::to($email)
                            ->template('email.otp', ['code' => $code])
                            ->subject($subject)
                            ->Send();

            return Response::api($msg, $sendMail);
        }

        if (!empty($phone_number)) {
            Otp::where('to', $phone_number)->where('proccess', 'register')->delete();
            $content = 'otp untuk pendaftaran kormi {{otp}} otp ini hanya berlaku dalam 2 menit';
            if ($type == 'forget_password') {
                $content = 'otp untuk reset password kormi {{otp}} otp ini hanya berlaku dalam 2 menit';
            }

            $smsOtp = SmsOtp::phoneNumber($phone_number)
                            ->key($code)
                            ->expiredIn(120)
                            ->content($content)
                            ->send();
            if ($smsOtp['type'] == 'success') {
                Otp::create(['to' => $phone_number, 'proccess' => $type, 'otp' => $code]);
            }

            return Response::api($smsOtp['type'], $smsOtp);
        }
    }

    public function create(Request $req)
    {
        $otp = $req->otp;
        if (empty($req->email) && empty($req->phone_number)) {
            return Response::apiError('Isi no hp atau Email', []);
        }

        $checkOtp = Otp::checkOtp($otp, 'register', $req->email, $req->phone_number);

        if (!$checkOtp) {
            return Response::apiError('otp salah', []);
        }

        $city = Cities::find($req->city);
        $email = $req->email ? $req->email : '';
        $phone_number = $req->phone_number ? $req->phone_number : '';
        $userReq = [
            'name' => $req->name,
            'role' => 0, // before it was 1
            'status' => 0,
            'provinces_id' => $city->province_id,
            'organitation_parent_id' => $req->organitation_parent,
            'organitation_status_id' => 0,
            'cities_id' => $req->city,
            'email' => $email,
            'phone_number' => $phone_number,
            'password' => Hash::make($req->password),
        ];

        $model = new User();

        if (!empty($email)) {
            $model = $model->where('email', $email);
        }

        if (!empty($phone_number)) {
            $model = $model->where('phone_number', $phone_number);
        }
        $user = $model->first();
        if ($user) {
            if ($user->status != 0) {
                return Response::apiError('User sudah terdaftar', []);
            }
            $user->update($userReq);
        } else {
            $user = User::create($userReq);
        }

        $endTime = strtotime('+60 minutes');
        $expired = date('Y-m-d H:i:s', $endTime);
        $checkPayment = RegisterPayment::where('order_id', 'like', '%REGISTER%')->where('status', 'PENDING')->where('email', $user->email)->where('expired', '>', $expired)->first();
        $linkInvoice = env('LINK_INVOICE').'/payment/method/';
        if ($checkPayment) {
            $payment = (object) [
                'link' => $linkInvoice.$checkPayment->invoice_id,
                'expired_date' => $checkPayment->expired,
            ];
        } else {
            $setting = Setting::first();
            $amount = ''.$setting->register_price.'';
            $url = env('LINK_PAYMENT').'/merchant/requestInvoice/v2';
            $code = uniqid('REGISTER-'.$user->id, false);
            $body = ['json' => [
                'merchantId' => env('MARCHANT_ID'),
                'merchantKey' => env('MARCHANT_KEY'),
                'orderId' => $code,
                'amount' => $amount,
                'orderInformations' => [[
                    'productName' => 'register kormi',
                    'quantity' => '1',
                    'amount' => $amount,
                    'nama' => $req->email,
                ]],
                'additionalInformation' => [
                    'emailNotif' => $req->email,
                    "subMerchantId"=> "Korminas-Sisti"
                ],
                'vaExpired' => 120,
            ]];
            $curl = Curl::Request('POST', $url, $body);

            $payment = (object) [];
            if ($curl['status_code'] == '200') {
                $content = json_decode($curl['content']);
                $payment = (object) [
                    'link' => $linkInvoice.$content->invoiceId,
                    'expired_date' => $content->expiredDate,
                ];
                RegisterPayment::create([
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'invoice_id' => $content->invoiceId,
                    'order_id' => $content->orderId,
                    'status' => 'PENDING',
                    'expired' => $content->expiredDate,
                ]);
            }
        }

        Otp::where('to', $req->phone_number)->where('proccess', 'register')->delete();
        Otp::where('to', $req->email)->where('proccess', 'register')->delete();

        return Response::api('Create App Succsess', ['payment' => $payment]);
    }

    public function updatemember($id, Request $req)
    {
        $this->validate($req, [
            'email' => 'required|email||unique:users,email,'.$id,
            'name' => 'required',
            'nik' => 'required|digits:16',
            'cities_id' => 'required',
        ]);
        $city = Cities::find($req->cities_id);

        $member = User::where('id', $id)->first();
        $member->name = $req->name;
        $member->nik = $req->nik;
        $member->cities_id = $req->cities_id;
        if(isset($city->province_id))
            $member->provinces_id = $city->province_id;
        $member->organitation_parent_id = $req->organitation_parent_id;
        $member->email = $req->email;
        $member->phone_number = $req->phone_number;
        if (!is_null($req->password) && $req->password != '') {
            $this->validate($req, [
                'password' => 'min:8',
            ]);
            $member->password = Hash::make($req->password);
        }
        $update = $member->save();

        if ($update) {
            return Response::api('Update Member Succsess', $member);
        }
    }

    public function generateUserNumber()
    {
        $all_user = User::whereNotNull("member_number")->get();
        foreach ($all_user as $key => $value) {
            $member = User::where('id', $value->id)->first();
            $no_member = User::createNoMember($member->id);
            $member->member_number = $no_member;
            $update = $member->save();
        }

        if ($update) {
            return Response::api('Update Member Succsess', count($all_user));
        }
    }

    public function createFromAdmin(Request $req)
    {
        $err = [];
        $success = [];
        $admin = Admin::find($req->auth->id);
        $users = \json_decode($req->users);
        $orders = [];
        $total_amount = 0;
        $setting = Setting::first();
        $usersNew = [];
        $messages = [];
        if (!is_array($users) || count($users) <= 0) {
            return Response::apiError('Member belum ditambahkan, tekan tombol plus (+) untuk menambahkan data member', []);
        }

        $phone_numbers = collect($users)->pluck('phone_number')->toArray();
        $phone_numbers = array_unique($phone_numbers);
        if (count($phone_numbers) != count($users)) {
            return Response::apiError('Some member data is invalid', ['Terdapat nomor handphone yang sama'], 422);
        }

        $emails = collect($users)->pluck('email')->toArray();
        $emails = array_unique($emails);
        if (count($emails) != count($users)) {
            return Response::apiError('Some member data is invalid', ['Terdapat email yang sama'], 422);
        }

        $organitation_status_ids = collect($users)->pluck('organitation_status_id')->toArray();
        if (count($organitation_status_ids) != count($users)) {
            return Response::apiError('Some member data is invalid', ['Status organisasi semua anggota harus diisi'], 422);
        }

        $new_users = [];

        foreach ($users as $key => $user) {
            $phone_number = $user->phone_number ? $user->phone_number : '';

            $saved_user = User::where(function($query) use ($user) {
                if (!empty($user->email)) {
                    $query->where('email', $user->email);
                }
            })->orWhere(function ($query) use ($phone_number) {
                if (!empty($phone_number)) {
                    $query->where('phone_number', $phone_number);
                }
            })->get();

            $rules = [
                'nik' => 'required|digits:16',
            ];

            $validator = Validator::make(['nik' => $user->nik ?? ""], $rules);
            if ($validator->fails())
            {
                $message = (object)[
                    "subject" => $user->name.' ('.trim($user->email.'/'.$phone_number, '/').')',
                ];
                $message->text = $validator->errors()->first();
                $message->type = "error";
                $err[] = '['.$user->name.' ('.$user->email.'/'.$phone_number.')] nik harus 16 digit';
                $messages[] = $message;
                continue;
            }

            if($saved_user && $saved_user->count() > 1)
            {
                $message = (object)[
                    "subject" => $user->name.' ('.$user->email.'/'.$phone_number.')',
                ];
                $message->text = "User sudah terbuat untuk masing email dan no. tlp";
                $message->type = "error";
                $err[] = '['.$user->name.' ('.$user->email.'/'.$phone_number.')] user sudah terbuat untuk masing email dan no. tlp';
                $messages[] = $message;
                continue;
            }

            if($saved_user)
                $saved_user = $saved_user->first();

            $user->create = true;

            if ($saved_user) {
                $message = (object)[
                    "subject" => $user->name.' ('.$user->email.'/'.$phone_number.')',
                ];
                if ($saved_user->status != 0) {
                    $message->text = "sudah terdaftar";
                    $message->type = "error";
                    $err[] = '['.$user->name.' ('.$user->email.'/'.$phone_number.')] sudah terdaftar';
                    $messages[] = $message;
                    continue;
                } else {
                    $expired = date('Y-m-d H:i:s');
                    $user_payment = RegisterPayment::where("user_id", $saved_user->id)->where("status","PENDING")->where("expired",">",$expired)->first();
                    if($user_payment){
                        $message->text = "dalam proses pendaftaran";
                        $message->type = "process";
                        $messages[] = $message;
                        continue;
                    }
                    $user->create = false;
                    $user->update_id = $saved_user->id;
                }
            }

            $new_users[] = $user;
        }

        // if (count($err) > 0) {
        //     return Response::apiError('Some member data is invalid', $err, 422);
        // }
        foreach ($new_users as $key => $user) {
            $password = "12345678";//Common::generateRandomString();
            $phone_number = isset($user->phone_number) ? $user->phone_number : '';
            $province = isset($user->province) && ($admin->role == 0 || $admin->role == 1) ? $user->province :$admin->provinces_id;
            $city = isset($user->city) && ($admin->role == 0 || $admin->role == 1 || $admin->role == 2) ? $user->city :$admin->cities_id;

            $parent = isset($user->parent) && $admin->role == 0 ? $user->parent :$admin->organitation_parent_id;
            $userReq = [
                'name' => $user->name,
                'nik' => $user->nik ?? '',
                'role' => 0,
                'status' => 0,
                'provinces_id' => $province,
                'organitation_parent_id' => $parent,
                'cities_id' => $city,
                'email' => $user->email ? $user->email : '',
                'organitation_status_id' => $user->organitation_status_id,
                'phone_number' => $phone_number,
                'password' => Hash::make($password),
            ];

            if(!isset($user->email))
            {
                $message->text = "user tidak bisa dbuat :" . $user->name;
                $message->type = "process";
                $messages[] = $message;
                Log::channel("payment")->info("user : " . json_encode($user));
                continue;
            }

            if (!$user->create) {
                $user = tap(User::where("id",$user->update_id))->update($userReq)->first();
            } else {
                $user = User::create($userReq);
            }
            $total_amount = $total_amount + $setting->register_price;
            $usersNew[] = $user;
            $orders[] = [
                'productName' => 'register kormi',
                'quantity' => '1',
                'amount' => (string) $setting->register_price,
                'nama' => $user->email,
            ];
            $success[] = '['.$user->name.' ('.$user->email.'/'.$phone_number.')]';
        }

        $endTime = strtotime('+60 minutes');
        $expired = date('Y-m-d H:i:s', $endTime);
        $linkInvoice = env('LINK_INVOICE').'/payment/method/';

        $amount = ''.$total_amount.'';
        $url = env('LINK_PAYMENT').'/merchant/requestInvoice/v2';
        $code = uniqid('ADMRGS-'.$admin->id.'-', false);
        $body = ['json' => [
            'merchantId' => env('MARCHANT_ID'),
            'merchantKey' => env('MARCHANT_KEY'),
            'orderId' => $code,
            'amount' => $amount,
            'orderInformations' => $orders,
            'additionalInformation' => [
                'emailNotif' => $admin->email,
                "subMerchantId"=> "Korminas-Sisti"
            ],
            'vaExpired' => 1200,
        ]];

        try{
            $payment = (object) [];

            $curl = Curl::Request('POST', $url, $body);

            if ($curl['status_code'] == '200') {
                $content = json_decode($curl['content']);
                $payment = (object) [
                    'link' => (empty($content->invoiceId)) ? "" :$linkInvoice.$content->invoiceId,
                    'expired_date' => $content->expiredDate,
                ];
                foreach ($usersNew as $key => $value) {
                    RegisterPayment::create([
                        'user_id' => $value->id,
                        'email' => $value->email,
                        'invoice_id' => $content->invoiceId,
                        'order_id' => $content->orderId,
                        'status' => 'PENDING',
                        'expired' => $content->expiredDate,
                    ]);
                }
            }
        }
        catch (\Exception $e) {
            Log::channel('payment')->error("payment error" . $e->getMessage());

            foreach ($usersNew as $val)
            {
                $val->status = -2;
                $val->save();
            }
            return Response::apiError('Payment Gateway sedang terjadi kendala', []);

//            Response::apiError('Create App Succsess', ['payment' => $payment, "message_error" => $messages, "message_success" => $success]);
        }

        return Response::api('Create App Succsess', ['payment' => $payment, "message_error" => $messages, "message_success" => $success]);
    }

    public function createInvoice(Request $request)
    {
        $id = $request->get('id');

        $admin = Admin::find($request->auth->id);

        if(!$id)
            return Response::apiError('ID user tidak valid');

        $user = User::find($id);

        if(!$user)
            return Response::apiError('data tidak ditemukan');

        // create invoice
        try{
            $setting = Setting::first();
            $amount = ''.$setting->register_price.'';
            $url = env('LINK_PAYMENT').'/merchant/requestInvoice/v2';
            $code = uniqid('REGISTER-'.$user->id, false);
            $body = ['json' => [
                'merchantId' => env('MARCHANT_ID'),
                'merchantKey' => env('MARCHANT_KEY'),
                'orderId' => $code,
                'amount' => $amount,
                'orderInformations' => [[
                    'productName' => 'register kormi',
                    'quantity' => '1',
                    'amount' => $amount,
                    'nama' => $user->email,
                ]],
                'additionalInformation' => [
                    'emailNotif' => $admin->email,
                    "subMerchantId"=> "Korminas-Sisti"
                ],
                'vaExpired' => 120,
            ]];
            $curl = Curl::Request('POST', $url, $body);

            $payment = (object) [];
            if ($curl['status_code'] == '200') {
                $content = json_decode($curl['content']);
                $linkInvoice = env('LINK_INVOICE').'/payment/method/';
                $payment = (object) [
                    'link' => $linkInvoice.$content->invoiceId,
                    'expired_date' => $content->expiredDate,
                ];
                RegisterPayment::create([
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'invoice_id' => $content->invoiceId,
                    'order_id' => $content->orderId,
                    'status' => 'PENDING',
                    'expired' => $content->expiredDate,
                ]);
            }

            $user->status = 0;
            $user->save();
        }
        catch (\Exception $e){
            return Response::apiError('Payment Gateway sedang ada kendala', []);
        }


        return Response::api('Create invoice success', [
            "user" => $user,
            "payment" => $payment
        ]);
    }


    public function changePassword(Request $request)
    {
        $update = [
            'password' => Hash::make($request->password),
        ];

        $user = User::where('id', $request->auth->id)->first();
        if (Hash::check($request->old_password, $user->password)) {
            $user->update($update);
            if (!$user) {
                return Response::apiError('Failed Update Profile', []);
            }

            return Response::api('Update Profile Success', $user);
        } else {
            return Response::apiError('password lama salah', []);
        }
    }

    public function profile(Request $request)
    {
        $user_id = $request->auth->id;
        $user = User::find($user_id);
        if (!$user) {
            return Response::apiError('Not Found User', $user);
        }

        $province = (object) [];
        $city = (object) [];
        $district = (object) [];
        $village = (object) [];
        $organitation_parent_label = '';
        if (!empty($user->provinces_id)) {
            $province = Province::find($user->provinces_id);
        }
        if (!empty($user->organitation_parent_id)) {
            $organitation_parent = MasterOrganitationParent::find($user->organitation_parent_id);
            $organitation_parent_label = $organitation_parent ? $organitation_parent->parent_name : '';
        }
        if (!empty($user->cities_id)) {
            $city = Cities::find($user->cities_id);
        }
        if (!empty($user->districts_id)) {
            $district = District::find($user->districts_id);
        }
        if (!empty($user->villages_id)) {
            $village = Village::find($user->villages_id);
        }
        $user->province = $province;
        $user->city = $city;
        $user->district = $district;
        $user->village = $village;
        $user->is_profile_completed = User::isProfileCompleted($user);
        $user->organitation_parent_label = $organitation_parent_label;

        return Response::api('Success Load Data Profile', $user);
    }

    public function profileJoinAdmin(Request $request)
    {
        $user_id = $request->auth->id;
        $user = User::find($user_id);
        if (!$user) {
            return Response::apiError('Not Found User', $user);
        }

        $joinAdmin = JoinAdmin::where('user_id', $user_id)->first();
        $status = isset($joinAdmin->status) ? $joinAdmin->status : -1;
        $res = (object) [
            'current_agency' => $user->current_agency,
            'organizational_experience' => $user->organizational_experience,
            'status_code' => $status,
            'status_text' => JoinAdmin::statusText($status),
        ];

        return Response::api('Success Load Data', $res);
    }

    /** List Member */
    public function listMember(Request $request)
    {
        $perPage = env('TOTAL_PER_PAGE', 20);
        if ($request->limit) {
            $perPage = $request->limit;
        }
        $admin = Admin::find($request->auth->id);

        $sort = User::sortedValue($request->sort_key, $request->sort_condition);
        $search = '%'.$request->search.'%';
        $status = $request->status;
        $province_id = $request->province;
        $city_id = $request->city;
        $membership = $request->membership;

        $Data = User::query()
            ->where(function ($query) use ($search) {
                if (!empty($search)) {
                    $query->Where('name', 'like', $search);
                    $query->orWhere('email', 'like', $search);
                }
            })
            ->where(function ($query) use ($status) {
                if (User::checkStatus($status)) {
                    $query->where('status', $status);
                }
            })
            ->where(function ($query) use ($province_id) {
                if (!empty($province_id)) {
                    $query->where('provinces_id', $province_id);
                }
            })
            ->where(function ($query) use ($city_id) {
                if (!empty($city_id)) {
                    $query->where('cities_id', $city_id);
                }
            })
            ->where(function ($query) use ($membership) {
                if (!empty($membership)) {
                    $query->where('organitation_status_id', $membership);
                }
            })
            // ->where("organitation_parent_id",$admin->organitation_parent_id)
            ->where(function ($query) use ($admin) {
                $filterParent = 1;
                switch ($admin->role) {
                    case '0':
                        $filterParent = 0;
                    break;
                    case '1':
                        break;
                    case '2':
                        $query->where('provinces_id', $admin->provinces_id);
                        break;
                    case '3':
                        $query->where('cities_id', $admin->cities_id);
                        break;
                    case '4':
                        break;
                    case '5':
                        $query->where('provinces_id', $admin->provinces_id);
                        break;

                    default:
                        // code...
                        break;
                }
                if($filterParent == 1){
                    if(!empty($admin->organitation_parent_id)){
                        $query->where('organitation_parent_id', $admin->organitation_parent_id);
                    }
                }
            })
            ->orderBy($sort->key, $sort->condition)->paginate($perPage);
        for ($i = 0; $i < count($Data); ++$i) {
            $Data[$i]['status_label'] = User::statusLabel($Data[$i]['status']);
            $Data[$i]['role_label'] = User::roleLabel($Data[$i]['role']);
            $province = (object) [];
            $city = (object) [];
            $organitation_status = (object) [];
            $organitation_parent = (object) [];

            if (!empty($Data[$i]['provinces_id'])) {
                $province = Province::find($Data[$i]['provinces_id']);
            }
            if (!empty($Data[$i]['cities_id'])) {
                $city = Cities::find($Data[$i]['cities_id']);
            }
            if (!empty($Data[$i]['organitation_parent_id'])) {
                $organitation_parent = MasterOrganitationParent::find($Data[$i]['organitation_parent_id']);
            }
            if (!empty($Data[$i]['organitation_status_id'])) {
                $organitation_status = MasterOrganitationStatus::find($Data[$i]['organitation_status_id']);
            }
            $Data[$i]['province'] = $province;
            $Data[$i]['city'] = $city;
            $Data[$i]['commission'] = '';
            $Data[$i]['organitation_parent'] = $organitation_parent;
            $Data[$i]['organitation_status'] = $organitation_status;
            $create_by = "personal (mobile)";
            $checkPayment = RegisterPayment::where('user_id', $Data[$i]['id'])->orderBy('updated_at', "DESC")->first();
            if($checkPayment){
                $check = explode("-",$checkPayment->order_id);
                if($check[0] == "ADMRGS")
                    $create_by = "admin (Web Cms)";
            }
            $Data[$i]["create_by"] = $create_by;
        }

        if (!$Data) {
            return Response::apiError('Not found data', []);
        }

        $res = [
            'status' => User::status(),
            'record' => $Data,
        ];

        return Response::api('Load member success', $res);
    }

    /** Detail Member */
    public function detailMember($id)
    {
        $user = User::where('id', $id)->first();
        $province = (object) [];
        $city = (object) [];
        $district = (object) [];
        $village = (object) [];
        $organitation_status = (object) [];
        $organitation_parent = (object) [];
        if (!empty($user->provinces_id)) {
            $province = Province::find($user->provinces_id);
        }
        if (!empty($user->cities_id)) {
            $city = Cities::find($user->cities_id);
        }
        if (!empty($user->organitation_parent_id)) {
            $organitation_parent = MasterOrganitationParent::find($user->organitation_parent_id);
        }
        if (!empty($user->organitation_status_id)) {
            $organitation_status = MasterOrganitationStatus::find($user->organitation_status_id);
        }
        if (!empty($user->districts_id)) {
            $district = District::find($user->districts_id);
        }
        if (!empty($user->villages_id)) {
            $village = Village::find($user->villages_id);
        }
        $user->province = $province;
        $user->city = $city;
        $user->district = $district;
        $user->village = $village;
        $user->organitation_parent = $organitation_parent;
        $user->organitation_status = $organitation_status;
        $user->commission = '';
        $user->status_label = User::statusLabel($user->status);
        $user->role_label = User::roleLabel($user->role);

        return Response::api('Load member succsess', $user);
    }

    /** List Admin */
    public function listJoinAdmin(Request $request)
    {
        $perPage = env('TOTAL_PER_PAGE', 20);
        $search = '%'.$request->search.'%';
        $sort = User::sortedValue($request->sort_key, $request->sort_condition);
        $data = joinAdmin::join('users', 'join_admin.user_id', '=', 'users.id')
                            ->where(function ($query) use ($search) {
                                $query->orWhere('users.name', 'like', $search);
                                $query->orWhere('users.email', 'like', $search);
                            })->orderBy('users.'.$sort->key, $sort->condition)->paginate($perPage);

        if (!$data) {
            return Response::apiError('Not found data', []);
        }

        for ($i = 0; $i < count($data); ++$i) {
            $data[$i]['user'] = User::find($data[$i]['user_id']);
        }

        return Response::api('Load admin success', $data);
    }

    public function import(Request $request)
    {
        $path = $request->file('file')->getRealPath();
        $myValueBinder = new ExcelStringBinder;
        $data = Excel::setValueBinder($myValueBinder)
            ->load($path)->toArray()[0];

        if(count($data))
        {
            $admin = Admin::find($request->auth->id);
            $setting = Setting::first();
            $newUsers =  [];
            $err =  [];
            $success =  [];
            $messages = [];
            $total_amount = 0;
            $orders = [];

            foreach($data as $newUser)
            {
                if(!isset($newUser['nik']) && !isset($newUser['nama']) && !isset($newUser['email']) && !isset($newUser['no_telepon'])
                    && !isset($newUser['id_provinsi']) && !isset($newUser['id_kota'])
                    && !isset($newUser['id_induk_organisasi']) && !isset($newUser['id_status_organisasi']))
                    continue;

                $newUser['nik'] = preg_replace('/\D/', '', $newUser['nik']);

                $newUser = array_map(function ($value){
                   return (string) $value;
                }, $newUser);

                $phoneNumber = isset($newUser['no_telepon']) ? '0' . ltrim($newUser['no_telepon'], '0') : null;

                $message = (object)[
                    "subject" => $newUser['nama'].' ('.trim($newUser['email'].'/'.$phoneNumber, '/.').')',
                ];

                $province = isset($newUser['id_provinsi']) && ($admin->role == 0 || $admin->role == 1) ? $newUser['id_provinsi'] :$admin->provinces_id;
                $city = isset($newUser['id_kota']) && ($admin->role == 0 || $admin->role == 1 || $admin->role == 2) ? $newUser['id_kota'] :$admin->cities_id;
                $parent = isset($newUser['id_induk_organisasi']) && $admin->role == 0 ? $newUser['id_induk_organisasi'] : $admin->organitation_parent_id;

                $rules = [
                    'nik' => 'required|digits:16',
                    'nama' => 'required',
                    'email' => 'required_without:no_telepon|email',
                    'no_telepon' => 'required_without:email|numeric',
                    'id_provinsi' => 'required|exists:provinces,id',
                    'id_kota' => [
                        'required',
                        Rule::exists('cities', 'id')->where(function ($query) use ($province) {
                            $query->where('province_id', $province);
                        }),
                    ],
                    'id_induk_organisasi' => 'required|exists:master_organitation_parent,id',
                    'id_status_organisasi' => 'required|exists:master_organitation_status,id',
                ];

                if($admin->role > 0)
                    unset($rules['id_induk_organisasi']);

                if($admin->role > 1)
                    unset($rules['id_provinsi']);

                if($admin->role > 2)
                    unset($rules['id_kota']);


                $validator = Validator::make($newUser, $rules, ["digits" => "Bidang isian Nik harus tepat 16 digit"]);

                if ($validator->fails())
                {
                    $message->text = $validator->errors()->first();
                    $message->type = "error";
                    $messages[] = $message;
                    continue;
                }

                $user = User::where(function($query) use ($newUser) {
                    if (!empty($newUser['email'])) {
                        $query->where('email', $newUser['email']);
                    }
                })->orWhere(function ($query) use ($phoneNumber) {
                    if (!empty($phoneNumber)) {
                        $query->where('phone_number', $phoneNumber);
                    }
                })->get();


                if($user && $user->count() > 1)
                {
                    $message->text = 'sudah ada 2 user untuk email dan no. tlp tersebut';
                    $message->type = "error";
                    $messages[] = $message;
                    continue;
                }

                if($user)
                    $user = $user->first();

                if(!$user)
                    $user = new User;
                // validasi klo user yg sudah ada
                if(isset($user->id) && $user->id)
                {

                    // aktif
                    if ($user->status != 0) {
                        $message->text = "sudah terdaftar";
                        $message->type = "error";
                        $messages[] = $message;
                        $err[] = '[' . $user->name . ' (' . $user->email . '/' . $phoneNumber . ')] sudah terdaftar';
                        continue;
                    }

                    // belum aktif
                    $expired = date('Y-m-d H:i:s');
                    $user_payment = RegisterPayment::where("user_id", $user->id)->where("status","PENDING")->where("expired",">",$expired)->first();
                    if($user_payment){
                        $message->text = "dalam proses pendaftaran";
                        $message->type = "process";
                        $messages[] = $message;
                        continue;
                    }

                }

                $password = Common::generateRandomString();

                $user->name = $newUser['nama'];
                $user->nik = $newUser['nik'];
                $user->role = 0;
                $user->status = 0;
                $user->provinces_id = $province;
                $user->organitation_parent_id = $parent;
                $user->cities_id = $city;
                $user->email = $newUser['email'] ?: '';
                $user->organitation_status_id = $newUser['id_status_organisasi'];
                $user->phone_number = $phoneNumber;
                $user->password = Hash::make($password);


                $user->save();

                $success[] = '['.$user->name.' ('.trim($user->email.'/'.$phoneNumber, '/').')]';

                $newUsers[] = $user;
            }

            return Response::api('Create App Succsess', ["message_error" => $messages, "message_success" => $success]);
        }

        return Response::apiError('tidak ada data yg di upload', [
            "message_error" => [
                [
                    'subject' => 'tidak ada data yg di upload',
                    'text' => 'tidak ada data yg di upload',
                    'type' => 'error'
                ]
            ]
        ]);
    }

    public function export(Request $request)
    {

        $admin = Admin::find($request->auth->id);

        $users = new User;
        if($admin->role == 2)
            $users = $users->where('provinces_id', $admin->provinces_id);

        if($admin->role == 3)
            $users = $users->where('cities_id', $admin->cities_id);

        if($admin->role >= 1 && $admin->role <= 3)
            $users = $users->where('organitation_parent_id', $admin->organitation_parent_id);

        if($users->count() < 1000)
        {
            $header = [
                'No. Member',
                'NIK',
                'NAMA',
                'EMAIL',
                'NO TELEPON',
                'PROVINSI',
                'KOTA',
                'INDUK OLAHRAGA',
                'STATUS ORGANISASI',
                'TANGGAL PENDAFTARAN',
                'TANGGAL PEMBAYARAN'
            ];
            ini_set('memory_limit','256M');
            $users = $users->with(['province', 'city', 'organitationStatus', 'organitationParent', 'registPay' => function($q){
                $q->where('status','=','PAID');
            }])->get();
            
           
            $path = 'storage/export/users/' . $admin->id;
            $excelName = $admin->id . "_user_" . date('Ymdhis');
            Excel::create($excelName, function($excel) use ($users, $header)
            {

                $excel->sheet('Sheet1', function($sheet) use ($users, $header) {
                    $row = 1;
                    $sheet->getStyle('A1:N1')->applyFromArray([
                        'font' => [
                            'bold' => true
                        ]
                    ]);
                    $sheet->row($row, $header);
    
                    foreach ($users as $user)
                    {
                        $row++;
                        $sheet->row($row, [
                            "$user->member_number ",
                            "$user->nik ",
                            $user->name,
                            $user->email,
                            "$user->phone_number ",
                            $user->province->name ?? '',
                            $user->city->name ?? '',
                            $user->organitationParent->parent_name ?? '',
                            $user->organitationStatus->title ?? '',
                            (new Carbon($user->created_at))->format('d-m-Y'),
                            isset($user->registPay->created_at) ? (new Carbon($user->registPay->created_at))->format('d-m-Y') : '',

                        ]);
                    }
                });

            })->store('xlsx', base_path('public/' . $path));

            return Response::api('Sukses', [
                'link_download' => url("$path/$excelName.xlsx"),
            ]);
        }

        $url = urlencode(url('/'));

        $this->dispatch(new ReportUserJob($admin->id, $url));
        return Response::api('Link akan dikirimkan ke alamat email anda', []);
    }

    public function templateExcel(Request $request)
    {
        $admin = Admin::find($request->auth->id);
        $provinceId = null;
        $cityId = null;

        if($admin->role > 1)
            $provinceId = $admin->provinces_id;

        if($admin->role > 2)
            $cityId = $admin->cities_id;

        $provincesQuery = new Province;
        $citiesQuery = new Cities;

        if($provinceId) {
            $provincesQuery = $provincesQuery->where('id', $provinceId);
            $citiesQuery = $citiesQuery->where('province_id', $provinceId);
        }

        $provinces = $provincesQuery->get();


        if($cityId)
            $citiesQuery = $citiesQuery->where('id', $cityId);
        $cities = $citiesQuery->get();

        $indukOrganisasi = MasterOrganitationParent::all();

        $staturOrganisasi = MasterOrganitationStatus::all();

        $path = 'storage/import/template/';
        $excelName = trim($provinceId. "_" . $cityId . "_" . 'template', '_');
        Excel::create($excelName, function($excel) use ($provinces, $cities, $indukOrganisasi, $staturOrganisasi, $admin){

            $excel->sheet('Sheet1', function($sheet) use ($provinces, $cities, $admin) {
                $array = [
                    'NIK','NAMA','EMAIL','NO TELEPON','ID PROVINSI','ID KOTA','ID INDUK ORGANISASI','ID STATUS ORGANISASI'
                ];

                if($admin->role == 1) {
                    $array = [
                        'NIK','NAMA','EMAIL','NO TELEPON','ID PROVINSI', 'ID KOTA','ID STATUS ORGANISASI'
                    ];
                }

                if($admin->role == 2) {
                    $array = [
                        'NIK','NAMA','EMAIL','NO TELEPON','ID KOTA','ID STATUS ORGANISASI'
                    ];
                }

                if($admin->role == 3) {
                    $array = [
                        'NIK','NAMA','EMAIL','NO TELEPON','ID STATUS ORGANISASI'
                    ];
                }
                $sheet->getStyle('A1:H1')->applyFromArray([
                    'font' => [
                        'bold' => true
                    ]
                ]);
                $sheet->row(1, $array);
                });

            $excel->sheet('tutorial penggunaan', function($sheet) use ($provinces, $cities) {
                $row = 0;
                $sheet->getStyle('A1:B1')->applyFromArray([
                    'font' => [
                        'bold' => true
                    ]
                ]);
                $sheet->row(++$row, ['TABEL','KETERANGAN']);
                $sheet->row(++$row, ['NIK','Wajib diisi 16 digit angka']);
                $sheet->row(++$row, ['NAMA','Wajib diisi sesuai KTP']);
                $sheet->row(++$row, ['EMAIL','Bisa tidak diisi jika nomer telepon sudah diisi']);
                $sheet->row(++$row, ['NO TELEPON','Bisa tidak diisi jika email  sudah diisi']);
                if($provinces->count() > 1)
                    $sheet->row(++$row, ['ID PROVINSI','Masukkan salah satu id pada sheet list provinsi']);
                if($cities->count() > 1)
                    $sheet->row(++$row, ['ID KOTA','Masukkan salah satu id pada sheet list kota']);
                $sheet->row(++$row, ['ID STATUS ORGANISASI','Masukkan salah satu id pada sheet list status organisasi']);
                $sheet->row(++$row, ['ID INDUK ORGANISASI','Masukkan kode induk pada sheet list induk organisasi']);

            });

            if($admin->role <= 2)
            {
                $excel->sheet('list provinsi', function($sheet) use ($provinces) {
                    $row = 1;
                    $sheet->row($row, [
                        'id', 'nama'
                    ]);

                    foreach ($provinces as $province) {
                        $row++;
                        $sheet->row($row, [
                            $province->id, $province->name
                        ]);
                    }
                });
            }

            if($admin->role <= 3)
            {
                $excel->sheet('list kota', function($sheet) use ($cities) {
                    $row = 1;
                    $sheet->row($row, [
                        'id', 'nama'
                    ]);

                    foreach ($cities as $city) {
                        $row++;
                        $sheet->row($row, [
                            $city->id, $city->name
                        ]);
                    }
                });
            }

            if($admin->role == 0 || $admin->role == 1){
                $excel->sheet('induk organisasi', function($sheet) use ($indukOrganisasi) {
                    $row = 1;
                    $sheet->row($row, [
                        'id', 'nama'
                    ]);

                    foreach ($indukOrganisasi as $val) {
                        $row++;
                        $sheet->row($row, [
                            $val->id, $val->parent_name
                        ]);
                    }
                });
            }


            $excel->sheet('status organisasi', function($sheet) use ($staturOrganisasi) {
                $row = 1;
                $sheet->row($row, [
                    'id', 'nama'
                ]);

                foreach ($staturOrganisasi as $val) {
                    $row++;
                    $sheet->row($row, [
                        $val->id, $val->title
                    ]);
                }
            });
        })->store('xlsx', base_path('public/' . $path));

        return Response::api('Sukses', [
            'link_download' => url("{$path}{$excelName}.xlsx"),
        ]);
    }

    public function bulkPayment(Request $request)
    {
        $userIds = $request->get('user_ids');

        if(!$userIds)
            return Response::apiError("tidak ada user yang dikirim ke server");

        if(!is_array($userIds))
            return Response::apiError("Format user salah");

        $users = User::whereIn('id', $userIds)->get();

        $success =  [];
        $messages = [];
        $total_amount = 0;
        $orders = [];

        $admin = Admin::find($request->auth->id);
        $setting = Setting::first();

        foreach ($users as $user)
        {
            $message = (object)[
                "subject" => $user->name.' ('.trim($user->email.'/'.$user->phone_number, '/.').')',
            ];
            // aktif
            if ($user->status != 0) {
                $message->text = "sudah terdaftar";
                $message->type = "error";
                $messages[] = $message;
                $err[] = '[' . $user->name . ' (' . $user->email . '/' . $user->phone_number . ')] sudah terdaftar';
                continue;
            }

            // belum aktif
            $expired = date('Y-m-d H:i:s');
            $user_payment = RegisterPayment::where("user_id", $user->id)->where("status","PENDING")->where("expired",">",$expired)->first();
            if($user_payment){
                $message->text = "dalam proses pendaftaran";
                $message->type = "process";
                $messages[] = $message;
                continue;
            }

            $total_amount = $total_amount + $setting->register_price;

            $orders[] = [
                'productName' => 'register kormi',
                'quantity' => '1',
                'amount' => (string) $setting->register_price,
                'nama' => $user->nama,
            ];

            $success[] = '['.$user->name.' ('.trim($user->email.'/'.$user->phone_number, '/').')]';

            $newUsers[] = $user;
        }

        $endTime = strtotime('+60 minutes');
        $expired = date('Y-m-d H:i:s', $endTime);
        $linkInvoice = env('LINK_INVOICE').'/payment/method/';

        $amount = ''.$total_amount.'';
        $url = env('LINK_PAYMENT').'/merchant/requestInvoice/v2';
        $code = uniqid('ADMRGS-'.$admin->id.'-', false);
        $body = ['json' => [
            'merchantId' => env('MARCHANT_ID'),
            'merchantKey' => env('MARCHANT_KEY'),
            'orderId' => $code,
            'amount' => $amount,
            'orderInformations' => $orders,
            'additionalInformation' => [
//                    'emailNotif' => 'fazaa.13@gmail.com',
                'emailNotif' => $admin->email,
                "subMerchantId"=> "Korminas-Sisti"
            ],
            'vaExpired' => 1200,
        ]];

        $payment = [];
        try{
            $curl = Curl::Request('POST', $url, $body);
            if ($curl['status_code'] == '200') {
                $content = json_decode($curl['content']);
                $payment = (object) [
                    'link' => (empty($content->invoiceId)) ? "" :$linkInvoice.$content->invoiceId,
                    'expired_date' => $content->expiredDate,
                ];

                foreach ($newUsers as $key => $value) {
                    RegisterPayment::create([
                        'user_id' => $value->id,
                        'email' => $value->email,
                        'invoice_id' => $content->invoiceId,
                        'order_id' => $content->orderId,
                        'status' => 'PENDING',
                        'expired' => $content->expiredDate,
                        'price' => $setting->register_price,
                    ]);
                }
            }
        }
        catch (\Exception $e)
        {
            Log::channel('payment')->error("Payment error ".$e->getMessage());
        }

        return Response::api('Create App Succsess', ['payment' => $payment, "message_error" => $messages, "message_success" => $success]);
    }

    public function store(Request $request)
    {
        $newUser = $request->all();
        $admin = Admin::find($request->auth->id);
//        return Response::apiError("error", $admin);

        $rules = [
            'nik' => 'required|digits:16',
            'name' => 'required',
            'email' => 'required_without:phone_number',
            'phone_number' => 'required_without:email|numeric',
            'province' => 'required|exists:provinces,id',
            'city' => [
                'required',
                Rule::exists('cities', 'id')->where(function ($query) use ($newUser, $admin) {
                    $province = $newUser['province'];

                    if(!$province)
                        $province = $admin->provinces_id;

                    Log::info($admin->provinces_id."$province");

                    $query->where('province_id', $province);
                }),
            ],
            'parent' => 'exists:master_organitation_parent,id',
            'organitation_status_id' => 'required|exists:master_organitation_status,id',
        ];

        if($admin->role > 1)
            unset($rules['province']);

        if($admin->role > 2)
            unset($rules['city']);

        $validator = Validator::make($newUser, $rules, ["digits" => "Bidang isian Nik harus tepat 16 digit"]);

        if($validator->fails()) {

            $errors = array_map(function($value){
                return $value[0] ?? $value;
            }, $validator->errors()->toArray());

            return Response::apiError('Data tidak valid',  $errors);
        }

        $user = User::where(function($query) use ($newUser) {
            if (!empty($newUser['email'])) {
                $query->where('email', $newUser['email']);
            }
        })->orWhere(function ($query) use ($newUser) {
            if (!empty($newUser['phone_number'])) {
                $query->where('phone_number', $newUser['phone_number']);
            }
        })->get();


        if($user && $user->count() > 1)
            return Response::apiError('Sudah ada 2 user untuk email dan no. tlp tersebut');

        if($user)
            $user = $user->first();

        if(!$user)
            $user = new User;
        // validasi klo user yg sudah ada
        if(isset($user->id) && $user->id)
        {

            // aktif
            if ($user->status != 0)
                return Response::apiError('User sudah aktif');

            // belum aktif
            $expired = date('Y-m-d H:i:s');
            $user_payment = RegisterPayment::where("user_id", $user->id)->where("status","PENDING")->where("expired",">",$expired)->first();
            if($user_payment)
                return Response::apiError('Dalam proses pendaftaran');

        }

        $password = Common::generateRandomString();

        $province = isset($newUser['province']) && ($admin->role == 0 || $admin->role == 1) ? $newUser['province'] :$admin->provinces_id;
        $city = isset($newUser['city']) && ($admin->role == 0 || $admin->role == 1 || $admin->role == 2) ? $newUser['city'] :$admin->cities_id;
        $parent = isset($newUser['parent']) && $admin->role == 0 ? $newUser['parent'] : $admin->organitation_parent_id;

        if(!$province){
            $cityObj = City::find($city);
            $province = $cityObj->province_id;
        }


        $user->name = $newUser['name'];
        $user->nik = $newUser['nik'];
        $user->role = 0;
        $user->status = 0;
        $user->provinces_id = $province;
        $user->organitation_parent_id = $parent;
        $user->cities_id = $city;
        $user->email = $newUser['email'] ?: '';
        $user->organitation_status_id = $newUser['organitation_status_id'];
        $user->phone_number = $newUser['phone_number'];
        $user->password = Hash::make($password);


        $user->save();

        return Response::api('sukses', compact('user'));
    }

    public function events(Request $request, $type = null) {
       
        $user = User::find($request->auth->id);
      
        $events = $user->events();
        //$events = $events->where('events.organitation_parent_id', $user->organitation_parent_id);
        
        if($type  == 'selesai') {
            $events = $events->where('events.event_end_date', '<=', Carbon::now()->toDateTimeString())
                ->whereIn('events.id', JoinEvent::where('user_id', $user->id)->where('status', '!=', 0)->get()->pluck('event_id'))
                ->orderBy('event_date', 'desc')
                ->paginate(25);

            return Response::api('data fetch', $events);
        }
        $events = $events->where('events.event_end_date', '>=', Carbon::now()->toDateTimeString())
            ->whereIn('events.id', JoinEvent::where('user_id', $user->id)->get()->pluck('event_id'));

        $events = $events->orderBy('event_date', 'desc')->paginate(25);
        return Response::api("ambil data sukses", $events);
    }
}
