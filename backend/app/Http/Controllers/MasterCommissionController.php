<?php

namespace App\Http\Controllers;

use App\Admin;
use App\Library\Asset;
use App\Library\Response;
use App\MasterCommission;
use App\MasterOrganitationParent;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class MasterCommissionController extends BaseController
{
    public function __construct(Request $request)
    {
        $this->_validation($request);
    }

    private function _validation($request)
    {
        $app_id = isset($req->auth->app_id) ? $req->auth->app_id : '';
        $data = [
            'update' => [
                        'commission_no' => 'required|max:255',
                        'commission_code' => 'required',
                        'commission_name' => 'required',
                        ],
            'create' => [
                        'commission_no' => 'required|max:255',
                        'commission_code' => 'required',
                        'commission_name' => 'required',
                        ],
            ];

        if (array_key_exists(Response::function(), $data)) {
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $req)
    {
        $admin = Admin::find($req->auth->id);
        if (in_array($admin->role, [0, 1, 4, 5])) {
            $perPage = env('TOTAL_PER_PAGE', 20);
            if ($req->limit) {
                $perPage = $req->limit;
            }
            $search = $req->search;
            $sort = MasterCommission::sortedValue($req->sort_key, $req->sort_condition);
            $res = MasterCommission::query()
                ->where(function ($query) use ($search) {
                    if (!empty($search)) {
                        $query->orWhere('commission_no', 'like', '%'.$search.'%');
                        $query->orWhere('commission_name', 'like', '%'.$search.'%');
                        $query->orWhere('commission_code', 'like', '%'.$search.'%');
                    }
                })
                ->where(function ($query) use ($admin) {
                    switch ($admin->role) {
                        case '4':
                            $query->where('id', $admin->commission_id);
                            break;
                        case '5':
                            $query->where('id', $admin->commission_id);
                            break;
    
                        default:
                            // code...
                            break;
                    }
                })
                ->orderBy($sort->key, $sort->condition)->paginate($perPage);

            $commissions = $res->getCollection();

            $new_commissions = $commissions->map(function ($commission) {
                $new_commissions = $commission;
                $new_commissions->total_parent_organization = MasterOrganitationParent::where('commission_id', $commission->id)->count();

                return $new_commissions;
            });

            $res->setCollection($new_commissions);

            return Response::api('Load Commission Succsess', $res);
        } else {
            return Response::api('Load Commission Succsess', []);
        }
    }

    public function update($id, Request $req)
    {
        $commission = MasterCommission::where('id', $id)->first();
        if (!$commission) {
            return Response::apiError('Not Found News', $commission, 404);
        }

        $commission->commission_name = $req->commission_name;
        $commission->commission_code = $req->commission_code;
        $commission->commission_no = $req->commission_no;

        $update = $commission->save();

        if ($update) {
            return Response::api('Update Master Succsess', $commission);
        }
    }

    public function create(Request $req)
    {
        $commission = [
                    'commission_name' => $req->commission_name,
                    'commission_code' => $req->commission_code,
                    'commission_no' => $req->commission_no,
                ];

        $create = MasterCommission::create($commission);
        if (!$create) {
            return Response::apiError('Not Found Master', (object) [], 404);
        }

        return Response::api('Update Master Succsess', $create);
    }

    public function detail($id, Request $req)
    {
        $commission = MasterCommission::where('id', $id)->first();

        return Response::api('Load Succsess', $commission);
    }

    public function delete($id)
    {
        $commission = MasterCommission::find($id);

        if (!$commission) {
            return Response::apiError('Not Found Master', $commission, 404);
        }

        $delete = $commission->delete();

        if ($delete) {
            return Response::api('Delete Master Succsess', $commission);
        }
    }

    public function uploadexcel(Request $req)
    {
        $excelpath = Asset::setPath('cms', 'mastercommission_upload_excel', time().'fileexcel.xlsx', 'admin');
        $upload = Asset::uploadImage($excelpath, $req->file('fileexcel'));
        dispatch(new MastercommissionJob($excelpath));

        return Response::api('Upload Data Excel Succsess', []);
    }
}
