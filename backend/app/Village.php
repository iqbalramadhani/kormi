<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
	protected $table = 'villages';

    public $timestamps = false;

    protected $fillable = [
        'id','name','district_id'
    ];

	public function District()
	{
	    return $this->belongsTo('App\District', 'district_id')->with('Cities');
	}
}
