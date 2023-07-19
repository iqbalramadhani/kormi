<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EventPayment extends Model
{
    protected $table = "event_payment";

    protected $fillable = [
        'user_id', 'event_id', 'invoice_id', 'order_id', 'status', 'expired', 'created_at', 'updated_at', 'price'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
}
