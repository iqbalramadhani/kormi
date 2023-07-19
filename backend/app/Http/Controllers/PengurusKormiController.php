<?php

namespace App\Http\Controllers;

use App\Admin;
use App\Jabatan;
use App\Library\ExportExcel;
use App\Library\Response;
use App\PengurusKormi;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Routing\Controller as BaseController;

class PengurusKormiController extends BaseController
{

    private function _validate($request, $id = null) {
        $this->validate($request, ['name' => 'required', 'jabatan_id' => 'required|exists:jabatan,id']);
    }

    public function index(Request $request)
    {
        $admin = Admin::find($request->auth->id);
        $perPage = $request->limit ?? env('TOTAL_PER_PAGE', 20);

        if($admin->role >= 2)
            return abort(403);

        $search = $request->get('keyword');
        $pengurus = PengurusKormi::with('jabatan')
            ->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%");
                $q->orWhereHas('jabatan', function ($query) use ($search){
                    $query->where('name', 'like', "%$search%");
                });
            });

        if($request->administrator_id)
            $pengurus = $pengurus->where('administrator_id', $request->administrator_id);

        $pengurus = $pengurus->paginate($perPage);
//        $administratorId = $request->administrator_id;
        return Response::api('fetch success', $pengurus);
    }

    public function store(Request $request)
    {

        try {
            $this->_validate($request);
        }
        catch (ValidationException $e){
            return Response::apiError("data tidak valid", $e->errors());
        }

        $admin = Admin::find($request->auth->id);

        $pengurus = new PengurusKormi;
        $pengurus->name = $request->get('name');
        $pengurus->jabatan_id = $request->get('jabatan_id');
        $pengurus->save();
        $pengurus->load('jabatan');
        return Response::api("Data telah tersimpan", $pengurus);
    }

    public function update(Request $request, $id)
    {
        try {
            $this->_validate($request);
        }
        catch (ValidationException $e){
            return Response::apiError("data tidak valid", $e->errors());
        }

        $pengurus = PengurusKormi::find($id);

        if(!$pengurus)
            return Response::apiError("ID tidak valid", $pengurus);

        $pengurus->name = $request->get('name');
        $pengurus->jabatan_id = $request->get('jabatan_id');
        $pengurus->save();
        $pengurus->load('jabatan');
        return Response::api("Data telah tersimpan", $pengurus);
    }

    public function show($id)
    {
        $pengurus = PengurusKormi::find($id);
        $pengurus->load('jabatan');
        return Response::api("sukses", $pengurus);
    }

    public function delete($id)
    {
        $pengurus = PengurusKormi::find($id);
        if(!$pengurus)
            return Response::apiError("Id tidak valid");
        $pengurus->delete();

        return Response::api("data telah terhapus", []);
    }

    // public function export(Request $request)
    // {
    //     $query = Pengurus::with('jabatan');


    //     $admin = Admin::find($request->auth->id);

    //     if($admin->role != 0 && $admin->role != 7)
    //         $query = $query->where('organitation_parent_id', $admin->organitation_parent_id);

    //     $queryResult = $query->get();

    //     $header = [
    //         "Nama" => 'name',
    //         "Jabatan" => "jabatan_text",
    //     ];

    //     $export = new ExportExcel($header, $queryResult, "pengurus_" . date("YmdHis"), $path = 'storage/export/pengurus', $ext = 'xlsx');

    //     $result = $export->export();

    //     return Response::api('sukses', [
    //         "file" => $result['url'],
    //     ]);

    // }
}
