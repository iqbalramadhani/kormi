<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = "notifications";

    protected $fillable = [
        'id', 'message', 'action', 'action_key', 'created_at', 'updated_at'
    ];
}