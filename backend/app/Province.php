<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $table = 'provinces';

    public $timestamps = false;

    protected $fillable = [
        'id','name'
    ];

    public function Cities()
    {
        return $this->hasMany('App\Cities', 'province_id');
    }

    public function districts()
    {
        return $this->hasMany('App\District');
    }

    public function User()
    {
        return $this->hasMany('App\User');
    }
}
