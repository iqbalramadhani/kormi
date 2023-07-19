<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NotificationTarget extends Model
{
    protected $table = "notification_targets";

    protected $fillable = [
        'id', 'user_id', 'notification_id', 'type', 'status_read', 'created_at', 'updated_at'
    ];
}