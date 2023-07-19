<?php 
namespace App\Library;
use Illuminate\Http\Request;

class Common {

    static function GetTrackLocation(Request $req, $fildDB = "show_for_location")
    {
        $track = [];
        if(!$req->auth){
            $track[$fildDB] = 0;
            return $track;
        }
        $actor = $req->auth;
        $track[$fildDB] = empty($actor->show_data_location) ? 0 : $actor->show_data_location;
        if ($actor->identity == "user"){
            $track[$fildDB] = 0;
        }
        return $track;
    }

    static function SetTrackLocation(Request $req)
    {
        $actor = $req->auth;
        if ($actor->identity == "admin"){
            if($actor->role == 0 || $actor->role == 1){
                return [];
            }
        }
        return $actor->show_data_location;
    }

    static function generateRandomString($length = 8) {
        $characters = '0123456@#789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}