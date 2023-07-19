<?php

namespace App\Http\Controllers;

use App\Library\Asset;
use App\Library\Response;
use App\MasterIndukOrganisasi;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class MasterIndukOrganisasiController extends BaseController
{
    public function __construct(Request $request, $req)
    {
        $this->_validation($request);
    }

    private function _validation($request, $req)
    {
        $app_id = isset($req->auth->app_id) ? $req->auth->app_id : '';
        $data = [
            'update' => [
                        'no_induk' => 'required',
                        'nama_induk' => 'required',
                        'no_bank_account' => 'required',
                        'main_province' => 'required',
                        ],
            'create' => [
                'no_induk' => 'required',
                'nama_induk' => 'required',
                'no_bank_account' => 'required',
                'main_province' => 'required',
                        ],
        ];

        if (array_key_exists(Response::function(), $data)) {
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $req)
    {
        $perPage = env('TOTAL_PER_PAGE', 20);
        if ($req->limit) {
            $perPage = $req->limit;
        }
        $search = $req->search;
        $category = $req->category;
        $status = $req->status;
        $month = $req->month;
        $year = $req->year;
        $sort = MasterIndukOrganisasi::sortedValue($req->sort_key, $req->sort_condition);
        $masterindukorganisasi = MasterIndukOrganisasi::select('induk_organisasi.*')
                   ->where(function ($query) use ($search) {
                       if (!empty($search)) {
                           $query->where('title', 'like', '%'.$search.'%');
                       }
                   })->orderBy('induk-organisasi.'.$sort->key, $sort->condition)->paginate($perPage);

        return Response::api('Load Induk Organisasi Succsess', $masterindukorganisasi);
    }

    public function detail($id, Request $req)
    {
        $masterindukorganisasi = MasterIndukOrganisasi::select('induk_organisasi.*')
        ->where('induk_organisasi.id', $id)->first();

        return Response::api('Load Induk Organisasi Succsess', $masterindukorganisasi);
    }

    public function update($id, Request $req)
    {
        $masterindukorganisasi = MasterIndukOrganisasi::where('id', $id)->first();
        if (!$masterindukorganisasi) {
            return Response::apiError('Not Found Induk Organisasi', $masterindukorganisasi, 404);
        }

        $imagePathad_rt = Asset::setPath($req->auth->id, 'induk_organisasinpwp', $masterindukorganisasi->id.'.png');
        $imagePathakta_notaris = Asset::setPath($req->auth->id, 'induk_organisasiad_rt', $masterindukorganisasi->id.'.png');
        $imagePathsk_kumham = Asset::setPath($req->auth->id, 'induk_organisasiakta_notaris', $masterindukorganisasi->id.'.png');
        $imagePathsusunan_pengurus = Asset::setPath($req->auth->id, 'induk_organisasisk_kumham', $masterindukorganisasi->id.'.png');
        $imagePathnpwp = Asset::setPath($req->auth->id, 'induk_organisasisusunan_pengurus', $masterindukorganisasi->id.'.png');

        $ad_rt = Asset::uploadImage($imagePathad_rt, $req->file('ad_rt'));
        $akta_notaris = Asset::uploadImage($imagePathakta_notaris, $req->file('akta_notaris'));
        $sk_kumham = Asset::uploadImage($imagePathsk_kumham, $req->file('sk_kumham'));
        $susunan_pengurus = Asset::uploadImage($imagePathsusunan_pengurus, $req->file('ad_rsusunan_pengurust'));
        $npwp = Asset::uploadImage($imagePathnpwp, $req->file('npwp'));

        $masterindukorganisasi->no_induk = $req->no_induk;
        $masterindukorganisasi->nama_induk = $req->nama_induk;
        $masterindukorganisasi->no_bank_account = $req->no_bank_account;
        $masterindukorganisasi->main_province = $req->main_province;

        if (!empty($ad_rt)) {
            $masterindukorganisasi->ad_rt = $ad_rt;
        }
        if (!empty($akta_notaris)) {
            $masterindukorganisasi->akta_notaris = $akta_notaris;
        }
        if (!empty($sk_kumham)) {
            $masterindukorganisasi->sk_kumham = $sk_kumham;
        }
        if (!empty($susunan_pengurus)) {
            $masterindukorganisasi->susunan_pengurus = $susunan_pengurus;
        }
        if (!empty($npwp)) {
            $masterindukorganisasi->npwp = $npwp;
        }

        $update = $masterindukorganisasi->save();

        if ($update) {
            return Response::api('Update News Succsess', $masterindukorganisasi);
        }
    }

    public function create(Request $req)
    {
        $imagePathad_rt = Asset::setPath($req->auth->id, 'induk_organisasinpwp', time().'.png');
        $imagePathakta_notaris = Asset::setPath($req->auth->id, 'induk_organisasiad_rt', time().'.png');
        $imagePathsk_kumham = Asset::setPath($req->auth->id, 'induk_organisasiakta_notaris', time().'.png');
        $imagePathsusunan_pengurus = Asset::setPath($req->auth->id, 'induk_organisasisk_kumham', time().'.png');
        $imagePathnpwp = Asset::setPath($req->auth->id, 'induk_organisasisusunan_pengurus', time().'.png');
        $ad_rt = Asset::uploadImage($imagePathad_rt, $req->file('ad_rt'));
        $akta_notaris = Asset::uploadImage($imagePathakta_notaris, $req->file('akta_notaris'));
        $sk_kumham = Asset::uploadImage($imagePathsk_kumham, $req->file('sk_kumham'));
        $susunan_pengurus = Asset::uploadImage($imagePathsusunan_pengurus, $req->file('ad_rsusunan_pengurust'));
        $npwp = Asset::uploadImage($imagePathnpwp, $req->file('npwp'));
        $masterindukorganisasi = ['no_induk' => $req->no_induk,
                'nama_induk' => $req->nama_induk,
                'ad_rt' => $ad_rt,
                'akta_notaris' => $akta_notaris,
                'sk_kumham' => $sk_kumham,
                'susunan_pengurus' => $susunan_pengurus,
                'npwp' => $npwp,
                'no_bank_account' => $req->no_bank_account,
                'main_province' => $req->main_province,
    ];

        $create = MasterIndukOrganisasi::create($masterindukorganisasi);

        return Response::api('Create Induk Organisasi Succsess', $create);
    }

    public function delete($id)
    {
        $masterindukorganisasi = MasterIndukOrganisasi::find($id);

        if (!$masterindukorganisasi) {
            return Response::apiError('Not Found Induk Organisasi', $masterindukorganisasi, 404);
        }

        $delete = $masterindukorganisasi->delete();

        if ($delete) {
            return Response::api('Delete Induk Organisasi Succsess', $masterindukorganisasi);
        }
    }
}
