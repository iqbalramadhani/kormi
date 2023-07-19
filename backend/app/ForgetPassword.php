<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ForgetPassword extends Model
{
    protected $table = 'forget_password';

    protected $fillable = [
        'code',
        'user_id',
        'created_at', 
        'updated_at',
    ];
}
