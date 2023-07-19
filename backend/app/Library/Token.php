<?php 
namespace App\Library;
use App\UserToken;
use App\User;
use App\UserTag;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use App\Library\Notification;

class Token {
    private function private_key($id,$platform,$onesignal_player_id="",$type = "user"){
        try{
            $key = md5($platform.$id.microtime().rand());
            $onesignal_player_id = !empty($onesignal_player_id) ? $onesignal_player_id : null;
            $data = UserToken::updateOrCreate(['code'=>$platform."-".$id,'user_id'=>$id,'platform'=>$platform],['onesignal_player_id'=>$onesignal_player_id,'private_key'=>$key]);
           
            $tagPublic = env("NOTIFICATION_PUBLIC_TAG");
            $checkTag = UserTag::where('user_id',$id)->where('tag',$tagPublic)->first();
            if(!$checkTag){
                Notification::addTag($id,$tagPublic);   
            }
            
            if($data){
                if(!empty($onesignal_player_id)){
                    $user_tag = UserTag::where('user_id',$id)->get();
                    $tags = [];
                    foreach ($user_tag as $k => $value) {
                        $tags[] = $value->tag;
                    }
                    Notification::addTagLogin($onesignal_player_id,$tags);
                }
            
                return $key;
            }
        return false;
        }catch (\Exception $e) {
            error_log(print_r($e->getMessage(),true));
            print_r($e->getMessage());
            return Response::apiError();
        } 
    } 

    public static function Create($user_id,$onesignal_player_id="",$platform = "web") {
        $This = (new self);
        $user = User::find($user_id);
        
        if(!$user)
            return false;
        
        $data = array ("id" => $user->id, // Subject of the token
            "role" => $user->role, // Subject of the token
            "platform" => $platform, // Subject of the token
            "refresh" => false,
            "identity" => "user",
            "show_data_location" => $user->provinces_id
        );
        $key = $This->private_key($user->id,$platform, $onesignal_player_id);
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