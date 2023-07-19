<?php 

namespace App\Library;


class Curl{
    
    protected $dirAsset = "/assets";

    protected $dirFile = array();

    public function __construct()
    {
    }

    public static function Request($methode, $url, $body)
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->request($methode, $url,$body);

        $statusCode = $response->getStatusCode();
        $content = $response->getBody();   

        return ["status_code"=>$statusCode,"content"=>$content->getContents()];
    } 
}