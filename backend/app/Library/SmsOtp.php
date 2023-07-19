<?php 

namespace App\Library;

use Illuminate\Support\Facades\Storage;
use Validator;
use App\UserTag;
use App\UserToken;
use App\Notification as Notif;
use App\NotificationTarget;

class SmsOtp {

    static $phoneNumber = "";
    static $expiredIn = 120;
    static $maxAttempt = 5;
    static $content = "otp dari kormi {{otp}}";
    static $digit = 5;
    static $key = "";
    static $otp = "";

    static function key($key)
    {
        self::$key = $key;
        return (new self);
    }

    static function otp($otp)
    {
        self::$otp = $otp;
        return (new self);
    }

    static function phoneNumber($phoneNumber)
    {
        self::$phoneNumber = $phoneNumber;
        return (new self);
    }

    static function expiredIn($expiredIn)
    {
        self::$expiredIn = $expiredIn;
        return (new self);
    }

    static function maxAttempt($maxAttempt)
    {
        self::$maxAttempt = $maxAttempt;
        return (new self);
    }

    static function content($content)
    {
        self::$content = $content;
        return (new self);
    }
    
    static function digit($digit)
    {
        self::$digit = $digit;
        return (new self);
    }

    public static function send(){
        if(empty(self::$phoneNumber))
            return ["type"=>"failed","message"=>"phone number belum di set"];
        if(empty(self::$key))
            return ["type"=>"failed","message"=>"set uniq key for otp"];

        $body = array(
            'phoneNum' => self::$phoneNumber,
            'maxAttempt' => self::$maxAttempt,
            'expireIn' => self::$expiredIn,
            'content' => self::$content,
            'digit' => self::$digit
        );

        $body = json_encode($body);
        $url = env("URL_SEND_SMS_OTP_BIGBOX","https://api.thebigbox.id/sms-otp/1.0.0/otp/").self::$key;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
                                                   'x-api-key: '.env("API_KEY_SMS_OTP_BIGBOX")));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $response = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if($code == 200){
            return ["type"=>"success","message"=>"sms otp sudah terkirim"];
        }

        return ["type"=>"failed","message"=>"gagal mengirim otp","error"=>$response];
    }

    public static function verify(){
        if(empty(self::$key))
            return false;
        if(empty(self::$otp))
            return false;

        $body = array(
            'otpstr' => self::$otp,
            'digit' => self::$digit,
            'expireIn' => self::$expiredIn,
        );

        $body = json_encode($body);
        $url = env("URL_SEND_SMS_OTP_BIGBOX","https://api.thebigbox.id/sms-otp/1.0.0/otp/").self::$key."/verifications";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
                                                   'x-api-key: '.env("API_KEY_SMS_OTP_BIGBOX")));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        $response = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if($code == 200)
            return true;

        return false;
    }
}