<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class JoinAdmin extends Model
{
    protected $table = "join_admin";

    protected $fillable = [
        'user_id', 'status', 'created_at', 'updated_at'
    ];

    protected function statusText($status = 0){
        
        $statusText = array(
            0=>"Menunggu persetujuan admin",
            -1=>"Belum Mengajukan",
        );     
    
        return isset($statusText[$status]) ? $statusText[$status] : "";
    }
}
