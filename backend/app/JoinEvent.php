<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class JoinEvent extends Model
{
    protected $table = "join_event";

    // protected $primaryKey = ['user_id', 'event_id'];

    protected $fillable = [
        'user_id',
        'event_id',
        'order_id',
        'invoice_id',
        'created_at',
        'no_booking',
        'price',
        'status',
        'updated_at'
    ];

    protected function createNoBooking($id=0, $urut=0){
        $no_urut = $urut;
        if($urut < 10)
            $no_urut = "0000".$urut;
        if($urut >= 10 && $urut < 100)
            $no_urut = "000".$urut;
        if($urut >= 100 && $urut < 1000)
            $no_urut = "00".$urut;
        if($urut >= 1000 && $urut < 10000)
            $no_urut = "0".$urut;
        $no_booking = date("y")."".date("m")."".$id.""."".$no_urut;
        return $no_booking;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

}
