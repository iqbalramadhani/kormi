<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class News extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'category',
        'tags',
        'image',
        'location',
        'description',
        'admin_id',
        'is_publish',
        'publish_time',
        'created_at',
        'updated_at',
        'deleted_at',
        'show_for_location',
        'organitation_parent_id',
        'gallery',
        'video_url',
        'hit',
    ];

    protected $dates =['deleted_at'];

    protected $appends = ['oraganisasi_induk', 'admin_name'];

    protected function sortedValue ($key="", $condition=""){
        $con = ["ASC","DESC"];
        $fillable = $this->fillable;
        $sort_key = in_array($key,$fillable) ? $key : "created_at";
        $sort_condition = in_array($condition,$con) ? $condition : "DESC";
        return (object)["key"=>$sort_key, "condition"=> $sort_condition];
    }

    protected function category($check =""){

        $categories = array("Berita","Artikel");

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

    public function newsFiles(){
        return $this->hasMany(NewsFiles::class, "news_id", 'id');
    }

    public function comments()
    {
        return $this->hasMany(NewsComment::class, 'news_id');
    }

    public function Likes()
    {
        return $this->hasMany(NewsLike::class, 'news_id');
    }

    public function organitationParent()
    {
        return $this->belongsTo(MasterOrganitationParent::class);
    }

    public function getOraganisasiIndukAttribute($value)
    {
        return ($this->relationLoaded('organitationParent')) ? ($this->organitationParent->parent_name ?? '') : '';
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function getAdminNameAttribute()
    {
        return ($this->relationLoaded('admin')) ? ($this->admin->name ?? '') : '';
    }

}
