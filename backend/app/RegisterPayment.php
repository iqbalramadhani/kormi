<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RegisterPayment extends Model
{
    protected $table = "register_payment";

    protected $fillable = [
        'id',
        'user_id',
        'email',
        'invoice_id',
        'order_id',
        'status',
        'expired',
        'created_at',
        'updated_at',
        'price'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
 