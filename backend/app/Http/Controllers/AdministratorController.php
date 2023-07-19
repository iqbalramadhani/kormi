<?php

namespace App\Http\Controllers;

use App\Admin;
use App\Administrator;
use App\Jobs\AdministratorJob;
use App\Library\Asset;
use App\Library\ExportExcel;
use App\Library\Response;
use App\provinces;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class AdministratorController extends BaseController
{
    public function __construct(Request $request)
    {
        $this->_validation($request);
        $this->model = new Administrator();
    }

    private function _validation($request)
    {
        $app_id = isset($request->auth->app_id) ? $request->auth->app_id : '';
        $data = [
            'update' => [
                'type' => 'required',
                'id_province' => 'required_if:type,2',
                'city_id' => 'required_if:type,3',
                'no_sk' => 'required',
                'about' => 'required',
                'last_date_sk' => 'required|date|after:now',
            ],
            'create' => [
                'type' => 'required',
                'id_province' => 'required_if:type,2',
                'city_id' => 'required_if:type,3',
                'no_sk' => 'required|unique:administrator',
                'about' => 'required',
                'last_date_sk' => 'required|date|after:'. date('Y-m-d'),
            ],
        ];

        if (array_key_exists(Response::function(), $data)) {
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $request)
    {
        $perPage = env('TOTAL_PER_PAGE', 20);
        if ($request->limit) {
            $perPage = $request->limit;
        }
        $query = $this->model->select('administrator.*');

        $query->select('administrator.*', 'cities.name as city_name' , 'provinces.name as province_name')
            ->leftJoin('cities', 'administrator.city_id', 'cities.id')
            ->leftJoin('provinces', 'administrator.id_province', 'provinces.id')
            ->withCount('pengurus');
        if (isset($request->province_id)) {
            $query->where('id_province', $request->id_province);
        }

        if (isset($request->city_id)) {
            $query->where('city_id', $request->city_id);
        }

        $keyword = (isset($request->search) && !empty($request->search)) ? $request->search : '';
        if (!empty($keyword)) {
            $query->where(
                'administrator.id_province', 'Like', '%'.$keyword.'%')
                ->orWhere('administrator.no_sk', 'Like', '%'.$keyword.'%')
                ->orWhere('administrator.about', 'Like', '%'.$keyword.'%')
                ->orWhere('administrator.last_date_sk', 'Like', '%'.$keyword.'%');
        }

        $admin = Admin::find($request->auth->id);

        if($admin->role != 0 && $admin->role != 7)
            $query = $query->where('organitation_parent_id', $admin->organitation_parent_id);

        $data = $query->paginate($perPage);

        if ($data->count() > 0) {
            return Response::api('Success', $data);
        }

        return Response::api('Empty Data', $data);
    }

    public function provinces(Request $req)
    {
        $administratorCategory = Administrator::provinces();

        return Response::api('Load News Succsess', $administratorCategory);
    }

    public function detail($id, Request $req)
    {
        $administrator = Administrator::select('administrator.*', 'provinces.name as provinces_name')
            ->leftJoin('provinces', 'administrator.id_province', '=', 'provinces.id')
            ->leftJoin('cities', 'administrator.city_id', '=', 'cities.id')
            ->where('administrator.id', $id)
            ->withCount('pengurus')
            ->first();

        return Response::api('Load Administrator Succsess', $administrator);
    }

    public function update($id, Request $req)
    {
        $administrator = Administrator::where('id', $id)->first();

        $admin = Admin::find($req->auth->id);

        $administrator->type = $req->type;
        $administrator->no_sk = $req->no_sk;
        $administrator->about = $req->about;
        $administrator->last_date_sk = $req->last_date_sk;
        $administrator->start_date_sk = $req->start_date_sk;
        $administrator->city_id = null;
        if($req->type == 2)
            $administrator->city_id = $req->city_id;

        $administrator->organitation_parent_id = $admin->organitation_parent_id;
        //$administrator->id_province = $req->id_province;

        $administrator->city_id = null;
        if($req->type == 3)
            $administrator->city_id = $req->city_id;

        $administrator->id_province = null;
        if($req->type == 2)
            $administrator->id_province = Administrator::provinces($req->id_province) ? $req->id_province : Administrator::provinces('0');

        if($admin->role != 0 && $admin->role != 7)
            $administrator->organitation_parent_id = $admin->organitation_parent_id;

        if($admin->role == 0 && $admin->role == 7)
            $administrator->organitation_parent_id = null;

        $update = $administrator->save();

        if ($update) {
            return Response::api('Update administrator Succsess', $administrator);
        }
    }

    public function create(Request $req)
    {

        $admin = Admin::find($req->auth->id);

        $administrator = [
            'type' => $req->type,
            'no_sk' => $req->no_sk,
            'about' => $req->about,
            'last_date_sk' => $req->last_date_sk,
            'start_date_sk' => $req->start_date_sk,
//            'city_id' => $req->city_id,
            // "id_province" => $req->id_province,

            'id_province' => Administrator::provinces($req->id_province) ? $req->id_province : Administrator::provinces('0'),
        ];
        $administrato['city_id'] = null;
        if($req->type == 3)
            $administrato['city_id'] = $req->city_id;

        $administrator['id_province'] = null;
        if($req->type == 2)
            $administrator['id_province'] = Administrator::provinces($req->id_province) ? $req->id_province : Administrator::provinces('0');

        if($admin->role != 0 && $admin->role != 7)
            $administrator['organitation_parent_id'] = $admin->organitation_parent_id;

        if($req->get('type') == 3)
            $administrator['city_id'] = $req->city_id;

        $administrator['id_province'] = null;
        if($req->type == 2)
            $administrator['id_province'] = Administrator::provinces($req->id_province) ? $req->id_province : Administrator::provinces('0');

        if($admin->role != 0 && $admin->role != 7)
            $administrator['organitation_parent_id'] = $admin->organitation_parent_id;

        $create = Administrator::create($administrator);

        if ($create) {
            return Response::api('Update administrator Succsess', $create);
        }
    }

    public function delete(Request $req, $id)
    {
        $administrator = Administrator::find($id);
        $location = $req->auth->show_data_location && !empty($req->auth->show_data_location) ? $req->auth->show_data_location : '0';

        $delete = $administrator->delete();

        if ($delete) {
            return Response::api('Delete administrator Succsess', $administrator);
        }
    }

    public function uploadexcel(Request $req)
    {
        $excelpath = Asset::setPath('cms', 'administrator_upload_excel', time().'fileexcel.xlsx', 'admin');
        $upload = Asset::uploadImage($excelpath, $req->file('fileexcel'));
        dispatch(new AdministratorJob($excelpath));

        return Response::api('Upload Data Excel Succsess', []);
    }

    public function export(Request $request)
    {
        $query = (new Administrator())->with('province', 'city');

        $admin = Admin::find($request->auth->id);

        if($admin->role != 0 && $admin->role != 7)
            $query = $query->where('organitation_parent_id', $admin->organitation_parent_id);

        $queryResult = $query->get();

        $header = [
            "No. SK" => 'no_sk',
            "Status" => "type_text",
            "Provinsi" => "province_name",
            "Kota" => "city_name",
            "Masa Bakti" => 'masa_bakti',
        ];

        $export = new ExportExcel($header, $queryResult, "sk_pengurus_" . date("YmdHis"), $path = 'storage/export/pengurus', $ext = 'xlsx');

        $result = $export->export();

        return Response::api('sukses', [
            "file" => $result['url'],
        ]);

    }

    public function geType()
    {
        return Response::api("data fetch", Administrator::getTypeList());
    }

    public function userPengurus(Request $request)
    {
        if(!$request->auth->id)
            return abort(404);

        try {
            $user = User::findOrFail($request->auth->id);
        }
        catch (\Exception $e) {
            return Response::apiError("User tidak valid");
        }

        $organitationId = $user->organitation_parent_id;
        $now = Carbon::now();
        $pengurus = Administrator::where('organitation_parent_id', $user->organitation_parent_id)
            ->where('created_at', '<=', $now)
            ->where('last_date_sk', '>=', $now)
            ->where('type', 1)
            ->first();

        $pengurus->load('pengurus.jabatan');

        return Response::api("data fetch", $pengurus);
    }
}
