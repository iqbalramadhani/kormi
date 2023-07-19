<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Province;
use Laravolt\Indonesia\Models\City;
use function GuzzleHttp\Psr7\str;

class Administrator extends Model
{
    protected $table = "administrator";
    protected $fillable = [
        'id_province',
        'city_id',
        'no_sk',
        'about',
        'last_date_sk',
        'start_date_sk',
        'created_at',
        'updated_at',
        'deleted_at',
        'type',
        'organitation_parent_id',
    ];

    use SoftDeletes;
    protected $dates =['deleted_at'];
    protected $appends = ['masa_bakti', 'type_text'];

    protected function sortedValue ($key="", $condition=""){
        $con = ["ASC","DESC"];
        $fillable = $this->fillable;
        $sort_key = in_array($key,$fillable) ? $key : "created_at";
        $sort_condition = in_array($condition,$con) ? $condition : "DESC";
        return (object)["key"=>$sort_key, "condition"=> $sort_condition];
    }

    protected function provinces($check =""){

        $provinsi =Province::select("provinces.id");
        // $categories = array($provinsi);
        // if(!empty($check)){
        //     if($check == "default")
        //         return $categories[0];
        //     if(in_array($check,$categories))
        //         return true;
        //     else
        //         return false;
        // }

        return $provinsi;
    }

    protected function getMasaBaktiAttribute(){

        $tahunawal = "-";
        if($this->start_date_sk)
            $tahunawal = date("Y", strtotime($this->start_date_sk));

        $tahunAkhir = "";
        if($this->last_date_sk)
            $tahunAkhir = date("Y", strtotime($this->last_date_sk));

        return trim(implode("-", [$tahunawal, $tahunAkhir]), '-');
    }

    public function pengurus()
    {
        return $this->hasMany(Pengurus::class);
    }

    public static function getTypeList()
    {
        return [
            ['value' => 1, "label" => "Nasional"],
            ['value' => 2, "label" => "Provinsi"],
            ['value' => 3, "label" => "Kab/Kota"],
        ];
    }

    public static function getTypeData()
    {
        return [
            1 => "Nasional",
            2 => "Provinsi",
            3 => "Kab/Kota",
        ];
    }

    public function getTypeTextAttribute()
    {
        return self::getTypeData()[$this->type] ?? '';
    }

    public function province(){
        return $this->belongsTo(Province::class, 'id_province');
    }

    public function city(){
        return $this->belongsTo(City::class);
    }

    public function getCityNameAttribute()
    {
        return $this->city->name ?? '';
    }

    public function getProvinceNameAttribute()
    {
        return $this->province->name ?? '';
    }
}
