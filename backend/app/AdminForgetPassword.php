<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AdminForgetPassword extends Model
{
    protected $table = 'admin_forget_password';

    protected $fillable = [
        'code',
        'admin_id',
        'created_at', 
        'updated_at',
    ];
}
