<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class NewsLike extends Model
{

    protected $fillable = [
        'news_id',
        'user_id',
    ];

    protected $appends = ['name'];

    protected $dates =['deleted_at'];

    public function news()
    {
        return $this->belongsTo(News::class, 'news_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getNameAttribute()
    {
        return $this->relationLoaded('user') ? $this->user->name : null;
    }

}
