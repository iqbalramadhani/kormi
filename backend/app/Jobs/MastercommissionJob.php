<?php

namespace App\Jobs;

use App\Administrator;
use App\MasterCommission;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
class MastercommissionJob extends Job
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
                $commission= new MasterCommission();
               // dd($value);
               $value = collect($value)->first();
               if($value) {
                $commission->commission_no=$value['commission_no'];

                $commission->commission_code=$value['commission_code'];
                $commission->commission_name=$value['commission_name'];
               
            $commission->save();
               }
            }
            
        });
        
    }
}
