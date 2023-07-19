<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Setting extends Model
{
    protected $table = "setting";
    protected $fillable = [
        'register_price', 'kormi_profile', 'message_invitation_register', 'created_at', 'updated_at'
    ];
}
