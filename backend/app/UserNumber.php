<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserNumber extends Model
{
    protected $table = "user_numbers";
    protected $fillable = [
        'sequence', 'prefix', 'user_id', 'status', 'created_at', 'updated_at'
    ];
}
