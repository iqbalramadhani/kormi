<?php

namespace App;

use Illuminate\Database\Eloquent\Model;;

class District extends Model
{
	protected $table = 'districts';

    public $timestamps = false;

    protected $fillable = [
        'id','name','city_id'
    ];

    public function Cities()
	{
	    return $this->belongsTo('App\Cities', 'city_id')->with('Province');
	}

	public function Villages()
    {
        return $this->hasMany('App\Village', 'district_id');
    }
    public function User()
    {
      return $this->hasMany('App\User');
    }
}
