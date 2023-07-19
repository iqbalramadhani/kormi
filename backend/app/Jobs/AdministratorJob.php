<?php

namespace App\Jobs;

use App\Administrator;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
class AdministratorJob extends Job
{
    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $file_excel;
    public function __construct($file_excel)
    {
       
       $this->file_excel=$file_excel;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Excel::load(Storage::disk(env('STOREG_DISK'))->path($this->file_excel), function ($ecxel) {
            
            foreach ($ecxel->toArray() as $value) {
               // print_r($value);die();
                $administrator= new Administrator();
               // dd($value);
               $value = collect($value)->first();
               if($value) {
                $administrator->id_province=$value['id_province'];

                $administrator->no_sk=$value['no_sk'];
                $administrator->about=$value['about'];
                $administrator->last_date_sk=$value['last_date_sk'];
            $administrator->save();
               }
            }
            
        });
        
    }
}
