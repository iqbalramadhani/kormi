<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Country extends Model{
    
    protected $table = 'countries';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    
    protected $fillable = [
        'id','name' 
    ];

    public $timestamps = false;

    public function Pmi()
    {
      return $this->hasMany('App\Pmi','destination_countries_id');
    }
    
}
