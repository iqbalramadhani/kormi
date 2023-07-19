<?php


namespace App\Http\Controllers;


use App\Admin;
use App\Http\Controllers\Traits\UploadFile;
use App\Http\Controllers\Traits\SettingIndukTrait;
use App\Library\Response;
use App\SettingInduk;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Lumen\Routing\Controller;

class SettingIndukController extends Controller
{
    use UploadFile, SettingIndukTrait;


    private $basePath = 'induk_logo';

    public function index(Request $request)
    {

        if($request->auth->identity == 'admin')
            $admin = Admin::find($request->auth->id);

        if($request->auth->identity == 'user')
            $admin = User::find($request->auth->id);

        $setting = $this->getSettings($admin->organitation_parent_id);


        return Response::api('Sukses ambil data', ['settings' => $setting]);
    }


    public function update(Request $request)
    {
        $admin = Admin::find($request->auth->id);

        if($admin->role == 0 && !$admin->organitation_parent_id)
            return Response::apiError('Pilih induk organisasi');

        if(!$admin->organitation_parent_id)
            return Response::apiError('Kamu bukan admin induk organisasi');

        $datas = $request->all();

        $validator = Validator::make($datas, ['logo' => 'mimes:png,jpg,jpeg', 'desain_logo' => 'mimes:png,jpg,jpeg']);
        if($validator->fails())
            return Response::apiError($validator->errors()->first(), $validator->errors());

        $setting = SettingInduk::whereIn('name', array_keys($this->fields))
            ->where('organitation_parent_id', $admin->organitation_parent_id)
            ->get()->keyBy('name');

        $errors = collect([]);

        foreach ($datas as $field => $value)
        {
            if(!isset($this->fields[$field]))
                continue;

            $updateSetting = $setting[$field] ?? null;

            if(!$updateSetting)
            {
                $updateSetting = new SettingInduk;
                $updateSetting->name = $field;
                $updateSetting->organitation_parent_id = $admin->organitation_parent_id;
            }
            if($this->fields[$field] != 'image')
                $updateSetting->value = $value;

            if($this->fields[$field] == 'image') {
                if(!isset($field) || !$field)
                    continue;

                try{
                    // delete image klo ada
                    if($updateSetting && $updateSetting->value)
                    {
                        $this->deleteFile($updateSetting->value);
                    }
                    $updateSetting->value = $value ? $this->uploadFile($value, $this->basePath) : '';
                }
                catch (\Exception $e) {
                    $errors->push([$field => 'Image tidak bisa di unggah coba beberapa saat lagi']);
                    continue;
                }
            }

            $updateSetting->save();
            $result[$field] = null;
             if($this->fields[$field] == "image"){
                 $result[$field] = $updateSetting->value ? $this->getUrl($updateSetting->value) : $updateSetting->value;
            }
        }

        return Response::api("Data berhasil disimpan", $result);
    }

    public function delete(Request $request, $field)
    {

        if($this->fields[$field] != 'image')
            return Response::apiError("Field yg di request bukan gambar");

        $admin = Admin::find($request->auth->id);

        $setting = SettingInduk::where('name', $field)
            ->where('organitation_parent_id', $admin->organitation_parent_id)
            ->get()->first();

        if(isset($setting->value) && !$setting->value)
            $this->deleteFile($setting->value);

        $setting->value = null;

        $setting->save();

        return Response::api("Gambar telah dihapus", []);
    }

}