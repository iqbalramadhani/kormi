<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $fillable = [
        'name', 'email', 'role', 'status', 'password', 'avatar', 'phone_number', 'provinces_id', 'cities_id', 'districts_id', 'villages_id', 'address', 'created_at',
        'organitation_parent_id',
        'organitation_status_id',
        'commission_id',
        'organitation_parent_id',
    ];

    protected $appends = ['role_text'];

    protected $adminRole = [
        ['value' => 0, 'label' => 'Super Admin'],
        ['value' => 1, 'label' => 'Admin Nasional'],
        ['value' => 2, 'label' => 'Admin Provinsi'],
        ['value' => 3, 'label' => 'Admin Kota'],
        ['value' => 6, 'label' => 'Admin Mandiri'],
//        ['value' => 7, 'label' => 'Admin Kormi'],
        // ['value' => 4, 'label' => 'Admin Komisi Olahraga'],
        // ['value' => 5, 'label' => 'Admin Komisi Olahraga Daerah'],
    ];

    protected $adminStatus = [
        ['value' => -1, 'label' => 'Suspend'],
        ['value' => 1, 'label' => 'Aktif'],
    ];

    protected function statusLabel($status)
    {
        foreach ($this->adminStatus as $key => $value) {
            if ($value['value'] == $status) {
                return $value['label'];
            }
        }

        return '';
    }

    protected function roleLabel($role)
    {
        foreach ($this->adminRole as $key => $value) {
            if ($value['value'] == $role) {
                return $value['label'];
            }
        }

        return '';
    }

    protected function roleList()
    {
        return $this->adminRole;
    }

    protected $hidden = ['password'];

    protected function isProfileCompleted($data)
    {
        $lable = [];
        for ($i = 0; $i < count($lable); ++$i) {
            if (empty($data[$lable[$i]])) {
                return false;
            }
        }

        return true;
    }

    protected function sortedValue($key = '', $condition = '')
    {
        $con = ['ASC', 'DESC'];
        $fillable = $this->fillable;
        $sort_key = in_array($key, $fillable) ? $key : 'created_at';
        $sort_condition = in_array($condition, $con) ? $condition : 'DESC';

        return (object) ['key' => $sort_key, 'condition' => $sort_condition];
    }

    protected function createNoMember($id = 0, $city_id = 0)
    {
        $no_id = $id;
        if ($id < 10) {
            $no_id = '0000'.$id;
        }
        if ($id >= 10 && $id < 100) {
            $no_id = '000'.$id;
        }
        if ($id >= 100 && $id < 1000) {
            $no_id = '00'.$id;
        }
        if ($id >= 1000 && $id < 10000) {
            $no_id = '0'.$id;
        }

        $code = date('y').''.$city_id.''.$no_id;

        return $code;
    }

    public function getRoleTextAttribute()
    {
        return $this->roleLabel($this->role);
    }
    
    public function city()
    {
        return $this->belongsTo(Cities::class, 'cities_id');
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'provinces_id');
    }
    
}
