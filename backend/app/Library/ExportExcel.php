<?php


namespace App\Library;


use Maatwebsite\Excel\Facades\Excel;
use Ramsey\Uuid\Uuid;

class ExportExcel
{
    private $header;
    private $data;
    private $path;
    /**
     * @var null
     */
    private $filename;
    /**
     * @var string
     */
    private $ext;
    /**
     * @var string
     */
    private $url;

    /**
     * ExportExcel constructor.
     * @param $header
     * @param $data
     */
    public function __construct($header, $data, $filename = null, $path = 'storage/export', $ext = 'xlsx')
    {
        $this->header = $header;
        $this->data = $data;
        $this->path = $this->setPath($path);
        $this->filename = $filename;
        $this->ext = $ext;
        $this->url = $this->setUrl($path);
    }

    public function getPath(){
        return $this->path;
    }

    public function setPath($path){
        return base_path("public/" . $path);
    }

    public function getUrl()
    {
        return $this->url;
    }

    public function setUrl($path)
    {
        return url($path);
    }

    public function export()
    {
        $success = true;
        $path = $this->getPath();
        $filename = $this->filename;
        $ext = $this->ext;
        $header = $this->header;
        $datas = $this->data;


        if(!$filename)
            $filename = Uuid::uuid1()->toString();

        $message = '';
        try{
            Excel::create($filename, function($excel) use ($header, $datas)
            {
                $excel->sheet('Sheet1', function($sheet) use ($header, $datas) {
                    $row = 1;
                    $sheet->row($row, array_keys($header));

                    foreach ($datas as $data)
                    {
                        $array = [];

                        foreach ($header as $value)
                        {
                            $array[] = $data->{$value} ?? '';
                        }
                        $row++;
                        $sheet->row($row, $array);
                    }
                });

            })->store($ext, $path);
        }
        catch (\Exception $e){
            $success = false;
            $message = "terjadi kesalahan pada server";
        }

        return [
            'success' => $success,
            'message' => $message,
            'full_path' => "{$path}/{$filename}.{$ext}",
            'url' => $this->getUrl() . "/{$filename}.{$ext}",
        ];
    }
}