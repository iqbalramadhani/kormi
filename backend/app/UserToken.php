<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserToken extends Model{
    
    protected $table = 'user_token';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    
    protected $fillable = [
        'code','platform','user_id','app_id','private_key','onesignal_player_id'
    ];
    
    protected $primaryKey = 'code'; // or null

}
