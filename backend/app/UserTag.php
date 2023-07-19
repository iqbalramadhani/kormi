<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserTag extends Model
{
    protected $table = "user_tags";

    protected $fillable = [
        'user_id',
        'tag',
        'created_at',
        'updated_at',
    ];
}