<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class NewsFiles extends Model
{
    protected $fillable = ['file', 'type', 'news_id'];

    protected $appends = ['file_url'];

    public function news()
    {
        return $this->belongsTo(News::class, "news_id");
    }

    public function getFileUrlAttribute()
    {
        return Storage::disk("public")->url($this->file);
    }
}
