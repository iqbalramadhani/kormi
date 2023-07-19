<?php

namespace App\Http\Controllers;

use App\Jabatan;
use App\Library\Response;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Routing\Controller as BaseController;

class JabatanController extends BaseController
{
    public function index(Request $request)
    {
        $perPage = $request->limit ?? env('TOTAL_PER_PAGE', 20);

        return Jabatan::paginate($perPage);
    }

    public function store(Request $request)
    {

        try {
            $this->validate($request, ['name' => 'required']);
        }
        catch (ValidationException $e){
            return Response::apiError("data tidak valid", $e->errors());
        }

        $jabatan = new Jabatan;
        $jabatan->name = $request->get('name');
        $jabatan->save();

        return Response::api("Data telah tersimpan", $jabatan);
    }

    public function update(Request $request, $id)
    {
        try {
            $this->validate($request, ['name' => 'required']);
        }
        catch (ValidationException $e){
            return Response::apiError("data tidak valid", $e->errors());
        }

        $jabatan = Jabatan::find($id);
        $jabatan->name = $request->get('name');
        $jabatan->save();

        return Response::api("Data telah tersimpan", $jabatan);
    }

    public function show($id)
    {
        $jabatan = Jabatan::find($id);

        return Response::api("Data telah tersimpan", $jabatan);
    }

    public function delete($id)
    {
            $jabatan = Jabatan::find($id);

            if(!$jabatan)
                return Response::apiError("id tidak valid", []);

            $jabatan->delete();

        return Response::api("data telah terhapus", []);
    }
}
