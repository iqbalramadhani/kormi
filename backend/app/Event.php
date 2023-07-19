<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Event extends Model
{
    protected $fillable = [
        'title',
        'category',
        'tags',
        'image',
        'location',
        'description',
        'admin_id',
        'webinar_url',
        'is_publish',
        'start_registration',
        'end_registration',
        'show_for_location',
        'event_date',
        'price',
        'publish_time',
        'created_at',
        'updated_at',
        'deleted_at',
        'organitation_parent_id',
//        'time_start',
//        'time_end',
        'event_end_date',
        'video_url',
        'type_id',
    ];

    use SoftDeletes;
    protected $dates =['deleted_at'];
    protected $appends = ['oraganisasi_induk', 'type', 'time_start', 'time_end', "is_end"];

    protected function sortedValue ($key="", $condition=""){
        $con = ["ASC","DESC"];
        $fillable = $this->fillable;
        $sort_key = in_array($key,$fillable) ? $key : "created_at";
        $sort_condition = in_array($condition,$con) ? $condition : "DESC";
        return (object)["key"=>$sort_key, "condition"=> $sort_condition];
    }

    protected function category($check =""){

        $categories = array("OFFLINE","ONLINE");

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


    protected function typeOffline($check =""){

        $categories = [
            [
                "label" => "Perlombaan",
                "value" => 1,
            ],
            [
                "label" => "Latihan Bersama",
                "value" => 2,
            ],
            [
                "label" => "Festival",
                "value" => 3,
            ],
            [
                "label" => "Seminar / Konferensi / Sarasehan",
                "value" => 4,
            ],
            [
                "label" => "Pameran",
                "value" => 5,
            ],
            [
                "label" => "Sosial",
                "value" => 6,
            ],
            [
                "label" => "Raker / Rakor / Musyawarah",
                "value" => 7,
            ],
        ];
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

    public function eventFiles()
    {
        return $this->hasMany(EventFile::class);
    }

    public function organitationParent()
    {
        return $this->belongsTo(MasterOrganitationParent::class);
    }

    public function getOraganisasiIndukAttribute($value)
    {
        return ($this->relationLoaded('organitationParent')) ? ($this->organitationParent->parent_name ?? '') : '';
    }

    public function getTypeAttribute($value)
    {

        if($this->category == "ONLINE") {
            if(!$this->webinar_url)
                return "";

            if(strpos($this->webinar_url, "google") !== false)
                return "GOOGLE";

            if(strpos($this->webinar_url, "zoom") !== false)
                return "ZOOM";

            return "Lainnya";
        }

        if($this->category == "OFFLINE") {
            if(!$this->type_id)
                return "";
            $typeId = $this->type_id;
            $type = collect($this->typeOffline())
                ->filter(function($value) use ($typeId){
                    return $typeId == $value['value'];
                })->first();

            return $type['label'] ?? null;
        }


        return null;
    }

    public function getTimeStartAttribute()
    {

        return $this->event_date ? date("H:i", strtotime($this->event_date)) : null;
    }

    public function getTimeEndAttribute()
    {
        return $this->event_end_date ? date("H:i", strtotime($this->event_end_date)) : null;
    }

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'join_event',
            "event_id",
            "user_id"
        );
    }

    public function getEventEndDateAttribute($value)
    {
        if($value == "0000-00-00 00:00:00")
            return '';
        return $value;
    }

    public function comments()
    {
        return $this->hasMany(EventComment::class);
    }

    public function getIsEndAttribute()
    {
//        dd($this->event_end_date, $this->event_date);
         $end = 0;
         if($this->event_end_date && $this->event_end_date != "0000-00-00 00:00:00")
         {
            if(Carbon::now()->gte($this->event_end_date))
                $end =  1;
            return $end;
         }

        return $end;
    }
}
