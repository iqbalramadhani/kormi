<?php 
namespace App\Library;
use Validator;

class Response {
    public static function api($message,$data)
    {
        $response = array("message"=>$message,"data"=>$data);
        return response()->json($response,200);
    }

    public static function apiEmpty($message=null,$data=null)
    {
        $msg = "";
        if( $data != null && is_array($data) ){
            $no = 0;
            foreach($data as $key=>$val){
                $no++;
                if($no == 1)
                $msg .= "By ";

                $msg .= $key.":".$val." ,"; 
            }
        }
        
        $empty = "Not Found Data ".$msg;
        $response = array("message"=>(!empty($message))?$message : "Empty Data",
                        "error"=>$empty );
        return response()->json($response,404);
    }

    public static function apiError($message=null,$data=null, $code=400)
    {
        $empty = "";
        $response = array("message"=>(!empty($message))?$message : "Something Wrong",
                        "error"=>(!empty($data))?$data : $empty );
        return response()->json($response,$code);
    }

    public static function function(){
        $action = app('request')->route();
        $action = explode("@",$action[1]['uses']);
        $function = $action[1];
        return $function;
    }

    public static function validate($input,$validate){
        $validator = Validator::make($input, $validate);
        if ($validator->fails()) {
            $err = array(
                "message" => "Validation Error",
                "error" => $validator->errors()
            );
            echo json_encode($err);die;
        }
    }

    public static function codeGenerete($id,$code="M"){
        $id=str_split($id);
        $codeRef=str_split('QWERTGHJKLYUIOPASDFZXCVNMB');
        $code .= $codeRef[rand(1,25)];
        $code .= $codeRef[rand(10,25)];
        $code .= $codeRef[rand(1,10)];
            foreach($id as $value){
                $code .= $codeRef[$value];
            }
        return ["code_booking"=>$code];
    }
}