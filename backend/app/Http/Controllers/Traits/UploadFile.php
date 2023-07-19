<?php


namespace App\Http\Controllers\Traits;


use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;

trait UploadFile
{
    private $disk = 'public';


    private function uploadFile($file, $path, $filename = '')
    {
        $name = Uuid::uuid4()->toString().'.'.$file->getClientOriginalExtension();
        if($filename)
            $name = $filename . $file->getClientOriginalExtension();

        $this->getDisk()->putFileAs("$path", $file, $name);

        return "{$path}/{$name}";
    }

    private function deleteFile($filepath)
    {
        return $this->getDisk()->delete($filepath);
    }

    public function getUrl($pathFile)
    {
        return $this->getDisk()->url($pathFile);
    }

    public function getDisk()
    {
        return Storage::disk($this->disk);
    }
}