<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Cities extends Model
{
    protected $table = 'cities';

    protected $fillable = [
        'id','name','province_id'
    ];

    public $timestamps = false;

    public function Province()
	{
	    return $this->belongsTo('App\Province', 'province_id');
	}

	public function Districts()
    {
        return $this->hasMany('App\District', 'city_id');
    }

    public function User()
    {
      return $this->hasMany('App\User');
    }
}
