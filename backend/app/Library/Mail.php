<?php 
namespace App\Library;
use Illuminate\Support\Facades\Mail as Email;

class Mail {
    static $to = "info@cms-kormi.id";
    static $subject = "Kormi";
    static $nameSender = "Kormi";
    static $from = "info@cms-kormi.id";
    static $template = array(
        "view" => "mail_default",
        "data" => ["msg"=>"hallo"]
    );

    static function to($to)
    {
        self::$to = $to;
        return (new self);
    }

    static function subject($subject)
    {
        self::$subject = $subject;
        return (new self);
    }

    static function nameSender($nameSender)
    {
        self::$nameSender = $nameSender;
        return (new self);
    }

    static function from($from)
    {
        self::$from = $from;
        return (new self);
    }

    static function template($content,array $data=[])
    {
        self::$template["view"] = $content;
        
        if (!empty($data) && is_array($data)) {
            self::$template["data"] = $data;
        }
        return (new self);
    }

    static function send()
    {
        try{
            $view = self::$template["view"];
            $data = self::$template["data"];
            $subject = self::$subject;
            $to = self::$to;
            $from = self::$from;
            $nameSender = self::$nameSender;

            Email::send($view, $data, function ($message) use ($subject, $nameSender, $to, $from)
            {
                $message->subject($subject);
                $message->from($from, $nameSender);
                $message->to($to);
            });
            return $response = array("type"=>"success","message"=>"Email Berhasil Dikirim");
        }
        catch (Exception $e){
            return $response = array("type"=>"danger","message"=>"Email Gagal Dikirim","error"=>$e->message());
        }
    }

}