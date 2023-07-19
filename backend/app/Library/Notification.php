<?php 

namespace App\Library;

use Illuminate\Support\Facades\Storage;
use Validator;
use App\UserTag;
use App\UserToken;
use App\Notification as Notif;
use App\NotificationTarget;

class Notification {

    public static function send($type,array $target_tag, $message, $action, $action_key, $in_app = false, $push_notif = false, $title = "Kormi")
    {
        if(!is_array($target_tag) || empty($target_tag))
            return false;

        $This = (new self);
        $resOs = [];
        foreach ($target_tag as $key => $tag) {
            if($key < 50){
                if($in_app)
                    $This->sendToInApp($type, $tag, $message, $action, $action_key);
                
                if($push_notif)
                    $resOs[] = $This->sendToOneSignal($tag, $message, $action, $action_key, $title);

                unset($target_tag[$key]);
            }else{
                $This->send($type, $target_tag, $message, $action, $action_key, $in_app, $push_notif);   
            }
        }

        return ["onsignal"=>$resOs];
    }
    
    private function sendToInApp($type, $target_tag, $message, $action, $action_key){
        $target = UserTag::where("tag",$target_tag)->first();
        if(empty($target))
            return false;
        
        $notif = Notif::create(["message" => $message,
                                "action" => $action,                                
                                "action_key" => $action_key,                                
                                ]);
        if(!empty($notif)){
            NotificationTarget::create([
                                        "user_id"=>$target->user_id, 
                                        "notification_id"=>$notif->id,
                                        "status_read"=>0,
                                        "type"=>$type]);
        }
    }

    private function sendToOneSignal($target_tag, $message, $action, $action_key, $title = "Kormi"){
        $headings = array(
            "en" => empty($title) ? "Bitlabs" : $title,
            );

        $content = array(
            "en" => $message
        );
        
        $data = array(
            "message" => $message,
            "action" => $action,
            "action_key" => $action_key,
        );
        $fields = array(
            'app_id' => env("APP_ID_ONESIGNAL"),
            'filters' => array(array("field" => "tag", "key" => $target_tag, "relation" => "=", "value" => $target_tag)),
            'data' => $data,
            'contents' => $content,
            'headings' => $headings
        );

        $fields = json_encode($fields);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
                                                   'Authorization: Basic '.env("REST_API_KEY_ONESIGNAL")));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    public static function addTag($user_id, $tag, $add_db = true)
    {
        $player_id_one_signal = "";
        $This = (new self);
        $user_token = UserToken::where('user_id',$user_id)->first();
        if(!empty($user_token) && !empty($user_token->onesignal_player_id))
            $player_id_one_signal = $user_token->onesignal_player_id;
        if($add_db){
            $user_tag = $This->addTagUser($user_id,$tag);
            if(!$user_tag)
                return false;
        }
        
        if(!empty($player_id_one_signal))
            $This->addTagOnesignal($player_id_one_signal,$tag);
        return true;
    }

    public static function addTagLogin($player_id_one_signal, $tag)
    {
        $This = (new self);
        $This->addTagOnesignal($player_id_one_signal,$tag);
    }

    public static function deleteTag($user_id, $tag)
    {
        $This = (new self);
        $player_id_one_signal = "35a05dd9-42e2-4d17-b89c-6e1c4eb79487";
        $user_tag = $This->deleteTagUser($user_id,$tag);
        if(!$user_tag)
            return false;
        if(!empty($player_id_one_signal))
            $This->deleteTagOnesignal($player_id_one_signal,$tag);
        return true;
    }
    
    private function addTagUser($user_id,$tag){
        return UserTag::updateOrCreate([
                                        "user_id" => $user_id,
                                        "tag" => $tag
                                        ],
                                        ["tag" => $tag]
                                        );
    }

    private function deleteTagUser($user_id,$tag){
        return UserTag::where("user_id", $user_id)->where("tag", $tag)->delete();
    }
    
    private function addTagOnesignal($player_id_one_signal,$tags){
        $onesignal_tags = [];
        if(\is_array($tags)){
            foreach ($tags as $key => $value) {
                $onesignal_tags [$value]= $value;
            }
        }else{
            $onesignal_tags = array($tags => $tags);
        }
        $fields = array( 
            'app_id' => env("APP_ID_ONESIGNAL"), 
            'tags' => $onesignal_tags
        ); 
        return $this->updateOnesignal($player_id_one_signal,$fields);
    }

    private function deleteTagOnesignal($player_id_one_signal,$tag){
        $fields = array( 
            'app_id' => env("APP_ID_ONESIGNAL"), 
            'tags' => array($tag => "")
        ); 
        return $this->updateOnesignal($player_id_one_signal,$fields);
    }

    private function updateOnesignal($player_id_one_signal,$fields){
        $fields = json_encode($fields); 

        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_URL, env("URL_ONESIGNAL").$player_id_one_signal); 
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json')); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
        curl_setopt($ch, CURLOPT_HEADER, false); 
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields); 
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
        $response = curl_exec($ch); 
        curl_close($ch); 

        $resultData = json_decode($response, true);
        
        return $resultData;
    }
}