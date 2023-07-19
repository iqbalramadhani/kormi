<?php 
namespace App\Library;
use App\AdminToken;
use App\Admin;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use App\Library\Notification;

class TokenAdmin {
    private function private_key($id,$platform,$onesignal_player_id="",$type = "user"){
        try{
            $key = md5($platform.$id.microtime().rand());
            $onesignal_player_id = !empty($onesignal_player_id) ? $onesignal_player_id : null;
            $data = AdminToken::updateOrCreate(['code'=>$platform."-".$id,'admin_id'=>$id,'platform'=>$platform],['private_key'=>$key]);
           
            
            if($data){
                return $key;
            }
        return false;
        }catch (\Exception $e) {
            error_log(print_r($e->getMessage(),true));
            print_r($e->getMessage());
            return Response::apiError();
        } 
    } 

    public static function Create($admin_id,$onesignal_player_id="",$platform = "web") {
        $This = (new self);
        $admin = Admin::find($admin_id);
        
        if(!$admin)
            return false;
        
        $data = array ("id" => $admin->id, // Subject of the token
            "role" => $admin->role, // Subject of the token
            "platform" => $platform, // Subject of the token
            "refresh" => false,
            "identity" => "admin",
            "show_data_location" => $admin->role > 1 ? $admin->provinces_id : 0
        );
        $key = $This->private_key($admin->id,$platform, $onesignal_player_id, "admin");
        if($key == false){
            return false;
        }
        
        $data["private_key"] = $key;
        $payload = [
            'iss' => "my token", // Issuer of the token
            'data' =>$data,
            'iat' => time(), // Time when JWT was issued. 
            'exp' => time() + ((60*60)*24)*365 // Expiration time
        ];
        
        $data_token = $payload;
        $data_token_refres = $payload;
        $data_token_refres['data']['refresh'] = true;
        $data_token_refres['exp'] = time() + ((60*60)*24)*365;
        $token = JWT::encode($data_token, env('JWT_SECRET'));
        $tokenRefresh = JWT::encode($data_token_refres, env('JWT_SECRET'));
        $data = array("token" => $token,"token_refresh" => $tokenRefresh);
        
        return $data;
    } 
}