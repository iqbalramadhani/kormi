<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class NewsComment extends Model
{

    protected $fillable = [
        'description',
        'user_id',
        'news_id',
    ];

    protected $dates =['deleted_at'];

    public function news()
    {
        return $this->belongsTo(News::class, 'news_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
