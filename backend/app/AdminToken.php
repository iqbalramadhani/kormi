<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AdminToken extends Model{
    
    protected $table = 'admin_token';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    
    protected $fillable = [
        'code','platform','admin_id','app_id','private_key','onesignal_player_id'
    ];
    
    protected $primaryKey = 'code'; // or null

}
