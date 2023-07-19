<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterOrganitationParent extends Model
{
    protected $table = 'master_organitation_parent';
    protected $fillable = [
        'id',
        'parent_no',
        'parent_name',
        'ad_rt',
        'notarial_deed',
        'sk_kumham',
        'commission_id',
        'board_of_management',
        'npwp',
        'bank_account_no',
        'main_province',
        'parent_code',
        'parent_sk',
        'bank_name',
    ];

    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected function sortedValue($key = '', $condition = '')
    {
        $con = ['ASC', 'DESC'];
        $fillable = $this->fillable;
        $sort_key = in_array($key, $fillable) ? $key : 'created_at';
        $sort_condition = in_array($condition, $con) ? $condition : 'DESC';

        return (object) ['key' => $sort_key, 'condition' => $sort_condition];
    }
}
