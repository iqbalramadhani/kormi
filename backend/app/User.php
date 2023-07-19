<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\MasterOrganitationParent;
use App\MasterCommission;
use App\UserNumber;

class User extends Model
{
    protected $fillable = [
        'name',
        'email',
        'role',
        'gender',
        'avatar',
        'birth_date',
        'phone_number',
        'place_of_birth_text',
        'provinces_id',
        'cities_id',
        'member_number',
        'place_of_birth',
        'districts_id',
        'villages_id',
        'address',
        'status',
        'nik',
        'post_code',
        'current_agency',
        'current_job',
        'profession',
        'organizational_experience',
        'created_at',
        'updated_at',
        'organitation_parent_id',
        'organitation_status_id',
        'password'
    ];

    protected $hidden = ['password'];

    protected function isProfileCompleted($data){
        $lable = [
            'name',
            'email',
            'gender',
            'phone_number',
            'place_of_birth_text',
            'birth_date',
            'provinces_id',
            'cities_id',
            'districts_id',
            'villages_id',
            'address',
            'post_code',
            'current_agency',
        ];
        for ($i=0; $i < count($lable) ; $i++) { 
            if(empty($data[$lable[$i]]))
                return false;
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

    protected $userStatus = [
        ['value' => -2, 'label' => 'Payment Gateway Terkendala'],
        ['value' => -1, 'label' => 'Suspend'],
        ['value' => 0, 'label' => 'Menunggu Pembayaran'],
        ['value' => 1, 'label' => 'Aktif'],
        ['value' => 2, 'label' => 'Menunggu Disetujui'],
    ];

    protected $userRole = [
        ['value' => 0, 'label' => 'Anggota'],
        ['value' => 1, 'label' => 'Pengurus'],
        ['value' => 2, 'label' => 'Pelatih'],
    ];

    protected function status()
    {
        return  $this->userStatus;
    }

    protected function checkStatus($status)
    {
        if ($status == '') {
            return false;
        }
        foreach ($this->userStatus as $key => $value) {
            if ($value['value'] == $status) {
                return true;
            }
        }

        return false;
    }

    protected function statusLabel($status)
    {
        foreach ($this->userStatus as $key => $value) {
            if ($value['value'] == $status) {
                return $value['label'];
            }
        }

        return '';
    }

    protected function roleLabel($role)
    {
        foreach ($this->userRole as $key => $value) {
            if ($value['value'] == $role) {
                return $value['label'];
            }
        }

        return '';
    }
    
    protected function createNoMember($id=0, $city_id=0){
        $user = $this->find($id);
        $organitation_parent = MasterOrganitationParent::find($user->organitation_parent_id);
        $commision_no = 0;

        if($city_id == 0){
            $city_id=$user->cities_id;
        }

        $parent_no = 0;
        if($organitation_parent){
            $commision = MasterCommission::find($organitation_parent->commission_id);
        
            if($commision){
                $commision_no = $commision->commission_no;
            }

            $no = $organitation_parent->parent_no;
            $parent_no = $no;
            if(strlen($no) == 1)
                $parent_no = "00".$no;
            if(strlen($no) == 2)
                $parent_no = "0".$no;
        }

        $prefix = date("y")."".$city_id."".$commision_no."".$parent_no;
        $sequence = 0;

        $check_user_number = UserNumber::where('user_id',$id)->count();
        if($check_user_number > 0){
            UserNumber::where('user_id',$id)->update(["status"=>0]);
        }
        $check_user_number_with_prefix = UserNumber::where('user_id',$id)->where("prefix",$prefix)->first();
        if($check_user_number_with_prefix){
            UserNumber::where('user_id',$id)->where("prefix",$prefix)->update(["status"=>1]);
            $sequence = $check_user_number_with_prefix->sequence;
        }else{
            $create_sequence = UserNumber::create(["prefix"=>$prefix,"user_id"=>$id]);
            $sequence = $create_sequence->id;
        }
        $no_id = $sequence;
        if($sequence < 10)
            $no_id = "0000".$sequence;
        if($sequence >= 10 && $sequence < 100)
            $no_id = "000".$sequence;
        if($sequence >= 100 && $sequence < 1000)
            $no_id = "00".$sequence;
        if($sequence >= 1000 && $sequence < 10000)
            $no_id = "0".$sequence;

        $code = $prefix.$no_id;
        return $code;
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'provinces_id');
    }

    public function district()
    {
        return $this->belongsTo(District::class, 'districts_id');
    }

    public function city()
    {
        return $this->belongsTo(Cities::class, 'cities_id');
    }

    public function village()
    {
        return $this->belongsTo(Village::class, 'villages_id');
    }

    public function organitationStatus()
    {
        return $this->belongsTo(MasterOrganitationStatus::class, 'organitation_status_id');
    }

    public function organitationParent()
    {
        return $this->belongsTo(MasterOrganitationParent::class, 'organitation_parent_id');
    }

    public function getProvinceNameAttribute($value)
    {
        return ($this->relationLoaded('province')) ? $this->province->name : '';
    }

    public function getCityNameAttribute($value)
    {
        return ($this->relationLoaded('city')) ? $this->city->name : '';
    }

    public function getOrganizationParentNameAttribute($value)
    {
        return ($this->relationLoaded('organitationParent')) ? ($this->organitationParent->parent_name ?? '') : '';
    }

    public function getOrganizationStatusNameAttribute($value)
    {
        return ($this->relationLoaded('organitationStatus')) ? ($this->organitationStatus->title ?? '') : '';
    }

    public function events() {
        return $this->belongsToMany(Event::class, "join_event", "user_id", "event_id");
    }

    public function registPay(){
        return $this->hasOne(RegisterPayment::class);
    }

}
