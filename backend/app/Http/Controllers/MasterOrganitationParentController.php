<?php

namespace App\Http\Controllers;

use App\Admin;
use App\Library\Asset;
use App\Library\Response;
use App\MasterCommission;
use App\MasterOrganitationParent;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\Library\ExcelStringBinder;
use App\Library\ExportExcel;
use Maatwebsite\Excel\Facades\Excel;

class MasterOrganitationParentController extends BaseController
{
    public function __construct(Request $request)
    {
        $this->_validation($request);
    }

    private function _validation($request)
    {
        $app_id = isset($request->auth->app_id) ? $request->auth->app_id : '';
        $data = [
            'update' => [
                        'parent_no' => 'required|max:255',
                        'parent_name' => 'required',
                        'commission_id' => 'required',
                        ],
            'create' => [
                        'parent_no' => 'required|max:255',
                        'parent_name' => 'required',
                        'commission_id' => 'required',
                    ],
            ];

        if (array_key_exists(Response::function(), $data)) {
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $req)
    {
        $admin_id = $req->auth ? $req->auth->id : 0;
        $admin = Admin::find($admin_id);
        $perPage = 5000;
        if ($req->limit) {
            $perPage = $req->limit;
        }
        $commission_id = $req->get('commission_id', null);
        $search = $req->search;
        $sort = MasterOrganitationParent::sortedValue($req->sort_key, $req->sort_condition);
        $res = MasterOrganitationParent::query()
            ->where(function ($query) use ($search) {
                if (!empty($search)) {
                    $query->orWhere('parent_no', 'like', '%'.$search.'%');
                    $query->orWhere('parent_name', 'like', '%'.$search.'%');
                }
            })
            ->where(function ($query) use ($commission_id) {
                if (!is_null($commission_id)) {
                    $query->where('commission_id', $commission_id);
                }
            })
            ->where(function ($query) use ($admin) {
                if ($admin) {
                    switch ($admin->role) {
                        case '2':
                            // No Filter Yet
                            break;
                        case '3':
                            // No Filter Yet
                            break;
                        case '4':
                            $query->where('commission_id', $admin->commission_id);
                            break;
                        case '5':
                            $query->where('commission_id', $admin->commission_id);
                            break;

                        default:
                            // code...
                            break;
                    }
                }
            })
            ->orderBy($sort->key, $sort->condition)->paginate($perPage);

        $file_fields = [
            'ad_rt',
            'notarial_deed',
            'sk_kumham',
            'board_of_management',
            'npwp',
            'bank_account_no',
            'main_province',
        ];

        for ($i = 0; $i < count($res); ++$i) {
            $commision = (object) [];
            $total_file = 0;
            foreach ($file_fields as $field) {
                if (!is_null($res[$i][$field])) {
                    ++$total_file;
                }
            }

            if ($res[$i]['commission_id']) {
                $commision = MasterCommission::find($res[$i]['commission_id']);
                if (!$commision) {
                    $commision = MasterCommission::onlyTrashed()->where('id', $res[$i]['commission_id'])->first();
                }
            }

            $res[$i]['commission'] = $commision;
            $res[$i]['total_file'] = $total_file;
        }

        return Response::api('Load Data Succsess', $res);
    }

    public function update($id, Request $req)
    {
        $parent = MasterOrganitationParent::where('id', $id)->first();
        if (!$parent) {
            return Response::apiError('Not Found Data', $parent, 404);
        }

        $parent->parent_name = $req->parent_name;
        $parent->commission_id = $req->commission_id;
        $parent->parent_no = $req->parent_no;
        $parent->parent_code = $req->parent_code;
        $parent->parent_sk = $req->parent_sk;
        $parent->bank_name = $req->bank_name;
        $parent->bank_account_no = $req->bank_account_no;

        $file_ad_rt = $req->file('ad_rt');
        if ($file_ad_rt) {
            $file_ad_rt_extension = array_last(explode('.', $file_ad_rt->getClientOriginalName()));
            $imagePathNameAdRt = Asset::setPath('cms', 'organitation_parent', $parent->id.'/ad-rt.'.$file_ad_rt_extension, 'admin');
            $parent->ad_rt = Asset::uploadImage($imagePathNameAdRt, $file_ad_rt);
        }

        $file_notarial_deed = $req->file('notarial_deed');
        if ($file_notarial_deed) {
            $file_notarial_deed_extension = array_last(explode('.', $file_notarial_deed->getClientOriginalName()));
            $imagePathNameND = Asset::setPath('cms', 'organitation_parent', $parent->id.'/notarial-deed.'.$file_notarial_deed_extension, 'admin');
            $parent->notarial_deed = Asset::uploadImage($imagePathNameND, $file_notarial_deed);
        }

        $file_sk_kumham = $req->file('sk_kumham');
        if ($file_sk_kumham) {
            $file_sk_kumham_extension = array_last(explode('.', $file_sk_kumham->getClientOriginalName()));
            $imagePathNameSK = Asset::setPath('cms', 'organitation_parent', $parent->id.'/sk-kumham.'.$file_sk_kumham_extension, 'admin');
            $parent->sk_kumham = Asset::uploadImage($imagePathNameSK, $file_sk_kumham);
        }

        $file_board_of_management = $req->file('board_of_management');
        if ($file_board_of_management) {
            $file_board_of_management_extension = array_last(explode('.', $file_board_of_management->getClientOriginalName()));
            $imagePathNameBoM = Asset::setPath('cms', 'organitation_parent', $parent->id.'/board-of-management.'.$file_board_of_management_extension, 'admin');
            $parent->board_of_management = Asset::uploadImage($imagePathNameBoM, $file_board_of_management);
        }

        $file_npwp = $req->file('npwp');
        if ($file_npwp) {
            $file_npwp_extension = array_last(explode('.', $file_npwp->getClientOriginalName()));
            $imagePathNameNpwp = Asset::setPath('cms', 'organitation_parent', $parent->id.'/npwp.'.$file_npwp_extension, 'admin');
            $parent->npwp = Asset::uploadImage($imagePathNameNpwp, $file_npwp);
        }

        $file_main_province = $req->file('main_province');
        if ($file_main_province) {
            $file_main_province_extension = array_last(explode('.', $file_main_province->getClientOriginalName()));
            $imagePathNameMainProvince = Asset::setPath('cms', 'organitation_parent', $parent->id.'/main_province.'.$file_main_province_extension, 'admin');
            $parent->main_province = Asset::uploadImage($imagePathNameMainProvince, $file_main_province);
        }

        $update = $parent->save();

        if ($update) {
            return Response::api('Update Master Succsess', $parent);
        }
    }

    public function updateFile($id, Request $req)
    {
        $parent = MasterOrganitationParent::where('id', $id)->first();
        if (!$parent) {
            return Response::apiError('Not Found Data', $parent, 404);
        }

        $file_name_req = $req->file_name;
        $file_name = [
            'ad_rt',
            'notarial_deed',
            'sk_kumham',
            'board_of_management',
            'npwp',
        ];

        if (!in_array($file_name_req, $file_name)) {
            return Response::apiError('Not Field', (object) [], 404);
        }

        $imagePathName = Asset::setPath('cms', 'organitation_parent', $parent->id.'/ad-rt.png', 'admin');
        $file = Asset::uploadImage($imagePathName, $req->file('file'));

        $update = $parent->update([$file_name_req => $file]);

        if ($update) {
            return Response::api('Update Master Succsess', $parent);
        }
    }

    public function create(Request $req)
    {
        $this->validate($req, [
            'commission_id' => 'exists:master_commission,id',
        ]);
        $parent = [
            'parent_name' => $req->parent_name,
            'parent_no' => $req->parent_no,
            'bank_account_no' => $req->bank_account_no,
            'commission_id' => $req->commission_id,
            'parent_code' => $req->parent_code,
            'parent_sk' => $req->parent_sk,
            'bank_name' => $req->bank_name,
        ];

        $create = MasterOrganitationParent::create($parent);
        if (!$create) {
            return Response::apiError('Not Found Master', (object) [], 404);
        }

        $file_ad_rt = $req->file('ad_rt');
        if ($file_ad_rt) {
            $file_ad_rt_extension = array_last(explode('.', $file_ad_rt->getClientOriginalName()));
            $imagePathNameAdRt = Asset::setPath('cms', 'organitation_parent', $create->id.'/ad-rt.'.$file_ad_rt_extension, 'admin');
            $create->ad_rt = Asset::uploadImage($imagePathNameAdRt, $file_ad_rt);
        }

        $file_notarial_deed = $req->file('notarial_deed');
        if ($file_notarial_deed) {
            $file_notarial_deed_extension = array_last(explode('.', $file_notarial_deed->getClientOriginalName()));
            $imagePathNameND = Asset::setPath('cms', 'organitation_parent', $create->id.'/notarial-deed.'.$file_notarial_deed_extension, 'admin');
            $create->notarial_deed = Asset::uploadImage($imagePathNameND, $file_notarial_deed);
        }

        $file_sk_kumham = $req->file('sk_kumham');
        if ($file_sk_kumham) {
            $file_sk_kumham_extension = array_last(explode('.', $file_sk_kumham->getClientOriginalName()));
            $imagePathNameSK = Asset::setPath('cms', 'organitation_parent', $create->id.'/sk-kumham.'.$file_sk_kumham_extension, 'admin');
            $create->sk_kumham = Asset::uploadImage($imagePathNameSK, $file_sk_kumham);
        }

        $file_board_of_management = $req->file('board_of_management');
        if ($file_board_of_management) {
            $file_board_of_management_extension = array_last(explode('.', $file_board_of_management->getClientOriginalName()));
            $imagePathNameBoM = Asset::setPath('cms', 'organitation_parent', $create->id.'/board-of-management.'.$file_board_of_management_extension, 'admin');
            $create->board_of_management = Asset::uploadImage($imagePathNameBoM, $file_board_of_management);
        }

        $file_npwp = $req->file('npwp');
        if ($file_npwp) {
            $file_npwp_extension = array_last(explode('.', $file_npwp->getClientOriginalName()));
            $imagePathNameNpwp = Asset::setPath('cms', 'organitation_parent', $create->id.'/npwp.'.$file_npwp_extension, 'admin');
            $create->npwp = Asset::uploadImage($imagePathNameNpwp, $file_npwp);
        }

        $file_main_province = $req->file('main_province');
        if ($file_main_province) {
            $file_main_province_extension = array_last(explode('.', $file_main_province->getClientOriginalName()));
            $imagePathNameMainProvince = Asset::setPath('cms', 'organitation_parent', $create->id.'/main_province.'.$file_main_province_extension, 'admin');
            $create->main_province = Asset::uploadImage($imagePathNameMainProvince, $file_main_province);
        }

        $create->save();

        return Response::api('Update Master Succsess', $create);
    }

    public function detail($id, Request $req)
    {
        $parent = MasterOrganitationParent::where('id', $id)->first();

        $commision = (object) [];
        if ($parent->commission_id) {
            $commision = MasterCommission::where('id', $parent->commission_id)->first();
            if (!$commision) {
                $commision = MasterCommission::onlyTrashed()->where('id', $parent->commission_id)->first();
            }
        }

        $parent->commission = $commision;

        return Response::api('Load Succsess', $parent);
    }

    public function delete($id)
    {
        $parent = MasterOrganitationParent::find($id);

        if (!$parent) {
            return Response::apiError('Not Found Master', $parent, 404);
        }

        $delete = $parent->delete();

        if ($delete) {
            return Response::api('Delete Master Succsess', $parent);
        }
    }


    public function export(Request $req)
    {

        $admin_id = $req->auth ? $req->auth->id : 0;
        $admin = Admin::find($admin_id);
       
        if ($req->limit) {
            $perPage = $req->limit;
        }

        $res = MasterOrganitationParent::where(function ($query) use ($admin) {
                if ($admin) {
                    switch ($admin->role) {
                        case '2':
                            // No Filter Yet
                            break;
                        case '3':
                            // No Filter Yet
                            break;
                        case '4':
                            $query->where('commission_id', $admin->commission_id);
                            break;
                        case '5':
                            $query->where('commission_id', $admin->commission_id);
                            break;

                        default:
                            // code...
                            break;
                    }
                }
            })
            ->get();
            $res = $res->toArray();
            $file_fields = [
                'ad_rt',
                'notarial_deed',
                'sk_kumham',
                'board_of_management',
                'npwp',
                'bank_account_no',
                'main_province',
            ];
    
            for ($i = 0; $i < count($res); ++$i) {
                $commision = (object) [];
                $total_file = 0;
                foreach ($file_fields as $field) {
                    if (!is_null($res[$i][$field])) {
                        ++$total_file;
                    }
                }
    
                if ($res[$i]['commission_id']) {
                    $commision = MasterCommission::find($res[$i]['commission_id']);
                    if (!$commision) {
                        $commision = MasterCommission::onlyTrashed()->where('id', $res[$i]['commission_id'])->first();
                    }
                }
    
                
                $res[$i]['total_file'] = $total_file;
            }

           

            $header = [
                'No. Induk',
                'SK Induk Organisasi',
                'Nama Induk Organisasi',
                'Jumlah Dokumen',
            ];
            ini_set('memory_limit','256M');
            
            $path = 'storage/export/master_organisasi/' . $admin->id;
            $excelName = $admin->id . "_user_" . date('Ymdhis');
            
           
            Excel::create($excelName, function($excel) use ($res, $header)
            {

                $excel->sheet('Sheet1', function($sheet) use ($res, $header) {
                    $row = 1;
                    $sheet->getStyle('A1:D1')->applyFromArray([
                        'font' => [
                            'bold' => true
                        ]
                    ]);
                    $sheet->row($row, $header);
    
                    foreach ($res as $data)
                    {
                        $row++;
                        $sheet->row($row, [
                            $data['parent_no'],
                            $data['parent_sk'],
                            $data['parent_name'],
                            $data['total_file']
                        ]);
                    }
                });

            })->store('xlsx', base_path('public/' . $path));

            return Response::api('Sukses', [
                'link_download' => url("$path/$excelName.xlsx"),
            ]);
        
    }
}
