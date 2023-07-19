<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class EventFile extends Model
{
    protected $fillable = ['file', 'type', 'event_id', 'organitation_parent_id'];

    protected $appends = ['file_url'];

    public function event()
    {
        return $this->belongsTo(Event::class, "event_id");
    }

    public function getFileUrlAttribute()
    {
        return Storage::disk("public")->url($this->file);
    }
}
