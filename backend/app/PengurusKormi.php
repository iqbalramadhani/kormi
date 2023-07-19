<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class PengurusKormi extends Model
{
    protected $table = 'pengurus_kormi';

    protected $appends = ['jabatan_text'];

    public function jabatan() {
        return $this->belongsTo(Jabatan::class);
    }

    public function getJabatanTextAttribute() {
      return  $this->jabatan->name;
  }
}
