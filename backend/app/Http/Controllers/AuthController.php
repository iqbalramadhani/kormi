<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Traits\SettingIndukTrait;
use App\Http\Controllers\Traits\UploadFile;
use Validator;
use App\Otp;
use App\User;
use App\UserToken;
use App\RegisterPayment;
use App\ForgetPassword;
use Illuminate\Http\Request;
use App\Library\Token;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Hash;
use Ramsey\Uuid\Uuid;
use App\Library\Mail;
use App\Library\Response;
class AuthController extends BaseController 
{
    use SettingIndukTrait, UploadFile;
    /**
     * The request instance.
     *
     * @var \Illuminate\Http\Request
     */
    private $request;
    /**
     * Create a new controller instance.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
    }

    /**
     * Authenticate a user and return the token if the provided credentials are correct.
     * 
     * @param  \App\User   $user 
     * @return mixed
     */
    public function login() {
        $this->validate($this->request, [
            'username'     => 'required',
        ]);
        
        // Find the user by email
        $user = User::where('email', $this->request->input('username'))
            ->with(['organitationParent'])
            ->orWhere('phone_number', $this->request->input('username'))
            ->first();
        if (!$user) {
            // You wil probably have some sort of helpers or whatever
            // to make sure that you have the same response format for
            // differents kind of responses. But let's return the 
            // below respose for now.
            return response()->json([
                'error' => "Akun belum terdaftar."
            ], 400);
        }
        // Verify the password and generate the token
        if (Hash::check($this->request->input('password'), $user->password)) {
            $data = $user;
            if ($data['status']==-1){
                return response()->json([
                    'error' => "Akun di suspend."
                ], 400);
            }
            if ($data['status']==2){
                return response()->json([
                    'error' => "Akun Belum Diaktifkan."
                ], 400);
            }
            if ($data['status']==0){
                $endTime = strtotime("+60 minutes");
                $expired = date('Y-m-d H:i:s', $endTime);
                $checkPayment = RegisterPayment::where("order_id","like", "%REGISTER%")->where("status","PENDING")->where("email",$user->email)->where("expired",">",$expired)->first();
                $payment = (object)[];
                if($checkPayment){
                    $linkInvoice = env("LINK_INVOICE")."/payment/method/";
                    $payment = (object)[
                        "link" => $linkInvoice.$checkPayment->invoice_id,
                        "expired_date" => $checkPayment->expired,
                    ];
                }

                if(empty($payment)){
                    return response()->json([
                        'error' => "Akun belum terdaftar."
                    ], 400);
                }
                return response()->json([
                    'error' => "Akun belum aktif.",
                    "data" => ['payment'=>$payment]
                ], 400);
            }

            $data['auth'] = Token::Create($user->id,$this->request->onesignal_player_id);
            $data['setting_induk'] = $this->getSettings($user->organitation_parent_id);
            if ($data['auth']==false){
                return response()->json([
                    'error' => 'Gagal Membuat Token.'
                ], 500);
            }
            return Response::api("Login Succsess",$data);
        }
        // Bad Request response
        return response()->json([
            'error' => 'Password Salah.'
        ], 400);
    }


    public function forgetPassword() {
        // dd($this->request->input('email'));
        $this->validate($this->request, [
            'email'     => 'required|email|exists:users',
        ]);
        // Find the user by email
        $user = User::where('email', $this->request->input('email'))->first();
        if (!$user) {
            // You wil probably have some sort of helpers or whatever
            // to make sure that you have the same response format for
            // differents kind of responses. But let's return the 
            // below respose for now.
            return response()->json([
                'error' => "Akun belum terdaftar."
            ], 400);
        }
            
        $uuid = Uuid::uuid1();
        // $code = $uuid->toString();
        $code = $user->id.mt_rand(10000, 99999);
        // $link = env("APP_URL")."dashboard/reset-password?code=".$code."&key=".$user->id;
        $link = env("APP_URL")."/auth/reset-password";

        $create =ForgetPassword::create(array("code" => $code, "user_id" => $user->id));
        
        if(!$create)
            return Response::apiError("Oops.. server sibuk");

        $sendMail = Mail::to($user->email)
                            ->template('email.forget_password',["name"=>$user->name,"link"=>$link,"code"=>$code])
                            ->subject("Konfirmasi Atur Ulang Katasandi")
                            ->Send();

        return Response::api("Succsess",$sendMail);
    }

    public function resetPassword() {
        $this->validate($this->request, [
            'password' => 'required|min:8|confirmed',
        ]);
        // Find the user by email
        $yesterday = date('Y-m-d', strtotime('-1 days'));
        
        $checkOtp = Otp::checkOtp($this->request->otp,"forget_password",$this->request->username,$this->request->username);   

        if (!$checkOtp)
            return Response::apiError("otp salah", []);

        $update = array(
            "password" => Hash::make($this->request->input('password')),
        );

        $user = User::where('email', $this->request->input('username'))->orWhere('phone_number', $this->request->input('username'))->first();
        $user_id = $user->id;
        if ($user){
            $user->update($update);
            if(!$user)
                return Response::apiError("Failed Update Profile",[]);
            
            Otp::where("to",$this->request->username)->where("proccess","forget_password")->delete();
            
            $data = $user;
            $data['auth'] = Token::Create($user->id,$this->request->onesignal_player_id);
            if ($data['auth']==false){
                return response()->json([
                    'error' => 'Failed Create Token.'
                ], 500);
            }
            return Response::api("Reset Password Succsess",$data);
        }else{
            return Response::apiError("Link dari email sudah kadarluarsa.");
        }
    }

    public function logout(Request $request) {
        try{
            $data = UserToken::where('private_key',$request->auth->private_key)->first();
            $data->delete();
            if($data){
                return Response::api('Success to Logout',$logout = true);
            }
        } catch (\Exception $e) {
            error_log(print_r($e->getMessage(),true));
            return Response::apiError();
        }
    }

}