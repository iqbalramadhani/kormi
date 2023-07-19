<?php

namespace App\Http\Controllers\Traits;

use App\SettingInduk;
use Illuminate\Support\Facades\Request;

trait SettingIndukTrait
{
    private $fields = [
        'logo' => 'image',
        'description' => 'string',
        'desain_kartu' => 'image'
    ];

    public function getSettings($organitationParentId)
    {
        $fields = array_keys($this->fields);
        $intersect = array_map(function($value){
            return "";
        }, array_flip(array_values($fields)));

        $settings = SettingInduk::where('organitation_parent_id', $organitationParentId)
            ->get()->map(function($value){

                if($this->fields[$value->name] == 'image')
                    $value->value = $value->value ? $this->getUrl($value->value) : "";
                return $value;

            })->pluck('value', 'name')->toArray();

        $newArray = array_merge($intersect, $settings);

        return $newArray;
    }
}