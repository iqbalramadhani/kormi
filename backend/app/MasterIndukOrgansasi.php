<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterIndukOrganisasi extends Model
{
    protected $table = "induk_organisasi";
    protected $fillable = [
        'no_induk',
        'nama_induk',
        'ad_rt',
        'akta_notaris',
        'sk_kumham',
        'susunan_pengurus',
        'npwp',
        'no_bank_account',
        'main_province',
        
    ];

    use SoftDeletes;
    protected $dates =['deleted_at'];

    protected function sortedValue ($key="", $condition=""){
        $con = ["ASC","DESC"];
        $fillable = $this->fillable;
        $sort_key = in_array($key,$fillable) ? $key : "created_at";
        $sort_condition = in_array($condition,$con) ? $condition : "DESC";
        return (object)["key"=>$sort_key, "condition"=> $sort_condition];
    }

    
}
