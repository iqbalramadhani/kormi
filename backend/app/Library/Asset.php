<?php 

namespace App\Library;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Validator;

class Asset{
    
    protected $dirAsset = "/assets";

    protected $dirFile = array();

    public function __construct()
    {
        $this->dirFile = [
            "logo" => $this->dirAsset."/app/logo/",
            "event" => $this->dirAsset."/event/",
            "avatar" => $this->dirAsset."/avatar/",
            "promotion" => $this->dirAsset."/promotion/",
            "news" => $this->dirAsset."/news/",
            "organitation_parent" => $this->dirAsset."/file/organitation-parent/",
            "administrator_upload_excel" => $this->dirAsset."/file/file-excel/",
            "mastercommission_upload_excel" => $this->dirAsset."/file/file-commission-excel/",
            "/"=>"/"
        ];
    }

    public static function setPath($id,$dir,$name = "",$prefix = "user"){
        $This = (new self);
        if(empty($id) || empty($dir) || !isset($This->dirFile[$dir]))
            return false;
        if(empty($name))
            $name = $id.".png";

        return $prefix."_".$id.$This->dirFile[$dir].$name;
    }

    public static function uploadImage($filePathName,$image, $base64=false)
    {
        if(!empty($image)){
            if($base64)
                $content = base64_decode($image);
            else
                $content = file_get_contents($image);
            $image = Storage::disk(env('STOREG_DISK'))->put($filePathName,$content,'public');
            if($image){
                $url = Storage::disk(env('STOREG_DISK'))->url($filePathName)."#".time();
                if(!Str::contains($url, ['http', 'https'])){
                    $url = env('STOREG_PUBLIC_DOMAIN').$url;
                }
                return $url;
            }
                return "";
        }else{
            return "";
        }
    }

    public static function deleteImage($url)
    {
        if(!empty($url)){
            $path = env("GOOGLE_CLOUD_STORAGE_API_URI");
            $image = Storage::disk(env('STOREG_DISK'))->delete(\str_replace($path,"",$url));
            if($image){
                return true;
            }
                return false;
        }else{
            return false;
        }
    }
    
}