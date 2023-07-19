<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Library\SmsOtp;

class Otp extends Model
{
    protected $table = 'user_otp';

    protected $fillable = [
        'otp',
        'to',
        'proccess',
        'created_at', 
        'updated_at',
    ];

    protected function checkOtp($otp,$type,$email,$phone_number){
        $checkOtp = false;
        if (!empty($phone_number)){
            $otpDetail = $this->where("to",$phone_number)->where("proccess",$type)->orderBy("created_at","DESC")->first();
            if($otpDetail){
                $checkOtp = SmsOtp::otp($otp)->key($otpDetail->otp)->verify();
                if($checkOtp){
                    $checkOtp = true;
                }
            }
        }
        if (!empty($email)){
            $otpDetail = $this->where("to",$email)->where("otp",$otp)->where("proccess",$type)->first();
            if($otpDetail){
                $checkOtp = true;
            }
        }

        return $checkOtp;
    }
}
