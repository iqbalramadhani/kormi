<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Pengurus extends Model
{
    protected $table = 'pengurus';

    protected $appends = ['jabatan_text'];

    public function jabatan() {
        return $this->belongsTo(Jabatan::class);
    }

    public function getJabatanTextAttribute() {
        return $this->jabatan_id && $this->relationLoaded('jabatan') ? $this->jabatan->name : null;
    }
}
