<?php

namespace App\Http\Controllers;

use App\Admin;
use App\AdminForgetPassword;
use App\AdminToken;
use App\Cities;
use App\Library\Mail;
use App\Library\Response;
use App\Library\TokenAdmin;
use App\MasterCommission;
use App\Province;
use App\RegisterPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Routing\Controller as BaseController;
use Ramsey\Uuid\Uuid;

class AdminAuthController extends BaseController
{
    /**
     * The request instance.
     *
     * @var \Illuminate\Http\Request
     */
    private $request;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Authenticate a user and return the token if the provided credentials are correct.
     *
     * @return mixed
     */
    public function login()
    {
        $this->validate($this->request, [
            'email' => 'required|email|exists:admins',
        ]);

        // Find the user by email
        $user = Admin::where('email', $this->request->input('email'))->first();
        if (!$user) {
            // You wil probably have some sort of helpers or whatever
            // to make sure that you have the same response format for
            // differents kind of responses. But let's return the
            // below respose for now.
            return response()->json([
                'error' => 'Email belum terdaftar.',
            ], 400);
        }
        // Verify the password and generate the token
        if (Hash::check($this->request->input('password'), $user->password)) {
            $data = $user;
            $data->province = Province::find($user->provinces_id);
            $data->city = Cities::find($user->cities_id);
            $data->commission = MasterCommission::find($user->commission_id);
            if ($data['status'] == -1) {
                return response()->json([
                    'error' => 'Akun Di Suspend.',
                ], 400);
            }
            if ($data['status'] == 0) {
                $endTime = strtotime('+60 minutes');
                $expired = date('Y-m-d H:i:s', $endTime);
                $checkPayment = RegisterPayment::where('status', 'PENDING')->where('email', $user->email)->where('expired', '>', $expired)->first();
                $payment = (object) [];
                if ($checkPayment) {
                    $payment = (object) [
                        'link' => env('LINK_PAYMENT').$checkPayment->invoice_id,
                        'expired_date' => $checkPayment->expired,
                    ];
                }

                return response()->json([
                    'error' => 'Akun belum aktif.',
                    'data' => ['payment' => $payment],
                ], 400);
            }

            $data['auth'] = TokenAdmin::Create($user->id, $this->request->onesignal_player_id);
            if ($data['auth'] == false) {
                return response()->json([
                    'error' => 'Gagal Membuat Token.',
                ], 500);
            }

            return Response::api('Login Succsess', $data);
        }
        // Bad Request response
        return response()->json([
            'error' => 'Password Salah.',
        ], 400);
    }

    public function forgetPassword()
    {
        $this->validate($this->request, [
            'email' => 'required|email|exists:admins',
        ]);
        // Find the user by email

        $admin = Admin::where('email', $this->request->input('email'))->first();
        if (!$admin) {
            // You wil probably have some sort of helpers or whatever
            // to make sure that you have the same response format for
            // differents kind of responses. But let's return the
            // below respose for now.
            return response()->json([
                'error' => 'Email belum terdaftar.',
            ], 400);
        }

        $uuid = Uuid::uuid1();
        // $code = $uuid->toString();
        $code = $admin->id.''.mt_rand(10000, 99999);
        $link = env('APP_URL').'dashboard/reset-password?code='.$code.'&key='.$admin->id;

        $create = AdminForgetPassword::create(['code' => $code, 'admin_id' => $admin->id]);

        if (!$create) {
            return Response::apiError('Oops.. server sibuk');
        }

        $sendMail = Mail::to($admin->email)
                            ->template('email.forget_password', ['name' => $admin->name, 'link' => $link, 'code' => $code])
                            ->subject('Konfirmasi Atur Ulang Katasandi')
                            ->Send();

        return Response::api('Succsess', $sendMail);
    }

    public function resetPassword()
    {
        $this->validate($this->request, [
            'password' => 'required|min:8|confirmed',
        ]);
        // Find the user by email
        $yesterday = date('Y-m-d', strtotime('-1 days'));
        $check_code = AdminForgetPassword::where('code', $this->request->input('code'))->whereDate('created_at', '>=', $yesterday)->first();
        if (!$check_code) {
            return Response::apiError('Link dari email sudah kadarluarsa.');
        }
        $admin_id = $check_code->admin_id;
        $update = [
            'password' => Hash::make($this->request->input('password')),
        ];

        $user = Admin::where('id', $admin_id)->first();
        if ($user) {
            $user->update($update);
            if (!$user) {
                return Response::apiError('Failed Update Profile', []);
            }

            AdminForgetPassword::where('admin_id', $admin_id)->delete();

            $data = $user;
            $data['auth'] = TokenAdmin::Create($user->id, $this->request->onesignal_player_id);
            if ($data['auth'] == false) {
                return response()->json([
                    'error' => 'Failed Create Token.',
                ], 500);
            }

            return Response::api('Reset Password Succsess', $data);
        } else {
            return Response::apiError('Link dari email sudah kadarluarsa.');
        }
    }

    public function logout(Request $request)
    {
        try {
            $data = AdminToken::where('private_key', $request->auth->private_key)->first();
            $data->delete();
            if ($data) {
                return Response::api('Success to Logout', $logout = true);
            }
        } catch (\Exception $e) {
            error_log(print_r($e->getMessage(), true));

            return Response::apiError();
        }
    }
}
