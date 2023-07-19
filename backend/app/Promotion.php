<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promotion extends Model
{
    protected $fillable = [
        'title',
        'category',
        'tags',
        'image',
        'cities_id',
        'location',
        'description',
        'terms',
        'user_id',
        'is_publish',
        'expired',
        'publish_time',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    use SoftDeletes;
    protected $dates =['deleted_at'];

    protected function sortedValue ($key="", $condition=""){
        $con = ["ASC","DESC"];
        $fillable = $this->fillable;
        $sort_key = in_array($key,$fillable) ? $key : "created_at";
        $sort_condition = in_array($condition,$con) ? $condition : "DESC";
        return (object)["key"=>$sort_key, "condition"=> $sort_condition];
    }
    
    protected function category($check =""){
        
        $categories = array("");     
        
        if(!empty($check)){
            if($check == "default")
                return $categories[0];
            if(in_array($check,$categories))
                return true;
            else
                return false;
        }
        
        return $categories;
    }
}
