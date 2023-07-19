<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterOrganitationStatus extends Model
{
    protected $table = "master_organitation_status";
    protected $fillable = ['id', 'title', 'description', 'created_at', 'updated_at', 'deleted_at'];

    use SoftDeletes;
    
    protected function sortedValue ($key="", $condition=""){
        $con = ["ASC","DESC"];
        $fillable = $this->fillable;
        $sort_key = in_array($key,$fillable) ? $key : "created_at";
        $sort_condition = in_array($condition,$con) ? $condition : "DESC";
        return (object)["key"=>$sort_key, "condition"=> $sort_condition];
    }

   
}
