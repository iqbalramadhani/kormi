<?php

namespace App\Http\Controllers;

use App\Admin;
use App\Cities;
use App\District;
use App\JoinAdmin;
use App\Library\Asset;
use App\Library\Common;
use App\Library\Mail;
use App\Library\Response;
use App\MasterOrganitationParent;
use App\Province;
use App\Village;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\Library\ExcelStringBinder;
use App\Library\ExportExcel;
use Maatwebsite\Excel\Facades\Excel;

class AdminController extends BaseController
{
    public function __construct(Request $request)
    {
        $this->_validation($request);
    }

    private function _validation($request)
    {
        $app_id = isset($request->auth->app_id) ? $request->auth->app_id : '';
        $roles = implode(',', collect(Admin::roleList())->pluck('value')->toArray());
        $data = [
            'changePassword' => [
                'password' => 'required|min:8|confirmed',
                'old_password' => 'required|min:8',
            ],
            'profileUpdate' => [
                'name' => 'required',
                'phone_number' => 'digits_between:6,13'
            ],
            'updateStatus' => [
                'status' => 'in:-1,1',
            ],
            'joinAdmin' => [
                'current_agency' => 'required',
                'organizational_experience' => 'required',
            ],
            'create' => [
                'role' => 'required|in:'.$roles,
                'name' => 'required',
                'email' => 'required|email|max:255',
                'phone_number' => 'digits_between:6,13'
            ],
            'roleUpdate' => [
                'role' => 'required',
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
        $search = '%'.$request->search.'%';
        $user = Admin::where('email', 'like', $search)->orWhere('name', 'like', $search)->paginate($perPage);
        if (!$user) {
            return Response::apiError('Not found data', []);
        }

        return Response::api('Search Success', $user);
    }

    public function profileUpdate(Request $request)
    {
        $update = [
            'name' => $request->name,
            'email' => $request->email,
            'gender' => $request->gender,
            'place_of_birth_text' => $request->place_of_birth_text,
            'phone_number' => $request->phone_number,
            'place_of_birth' => $request->place_of_birth && $request->place_of_birth != 'null' ? $request->place_of_birth : null,
            'provinces_id' => $request->provinces_id && $request->provinces_id != 'null' ? $request->provinces_id : null,
            'cities_id' => $request->cities_id && $request->cities_id != 'null' ? $request->cities_id : null,
            'districts_id' => $request->districts_id && $request->districts_id != 'null' ? $request->districts_id : null,
            'villages_id' => $request->villages_id && $request->villages_id != 'null' ? $request->villages_id : null,
            'address' => $request->address,
            'post_code' => $request->post_code,
            'birth_date' => $request->birth_date && $request->birth_date != 'null' ? $request->birth_date : null,
            'current_agency' => $request->current_agency,
            'profession' => $request->profession,
            'organizational_experience' => $request->organizational_experience,
        ];

        $user = Admin::where('id', $request->auth->id)->first();
        $user->update($update);
        if (!$user) {
            return Response::apiError('Failed Update Profile', []);
        }

        return Response::api('Update Profile Success', $user);
    }

    public function updateStatus($id, Request $request)
    {
        $update = [
            'status' => (int) $request->status,
        ];

        $user = Admin::where('id', $id)->first();
        if (!$user) {
            return Response::apiError('Failed Update Profile', []);
        }
        $user->update($update);

        return Response::api('Update Profile Success', $user);
    }

    public function delete($id, Request $request)
    {
        $user = Admin::where('id', $id)->first();
        if (!$user) {
            return Response::apiError('Failed Admin Not Found', []);
        }

        if ($user->status == 1) {
            return Response::apiError('Failed Delete Admin Active', []);
        }

        $user->delete();

        return Response::api('Delete Admin Success', true);
    }

    public function roleUpdate($id, Request $request)
    {
        $update = [
            'role' => $request->role,
        ];

        $user = Admin::where('id', $id)->first();
        $user->update($update);
        if (!$user) {
            return Response::apiError('Failed Update Profile', []);
        }

        return Response::api('Update Profile Success', $user);
    }

    public function avatarUpdate(Request $request)
    {
        $imagePathName = Asset::setPath($request->auth->id, 'avatar', $request->auth->id.'.png', 'admin');
        $avatar = $request->avatar;
        $avatar = explode(',', $avatar);
        $avatar = Asset::uploadImage($imagePathName, $avatar[1], true);

        $update = [
            'avatar' => $avatar,
        ];

        $user = Admin::where('id', $request->auth->id)->first();

        $user->update($update);
        if (!$user) {
            return Response::apiError('Failed Update Profile', []);
        }

        return Response::api('Update Profile Success', $user);
    }

    public function profession()
    {
        return Response::api('Success Load Data', Admin::profession());
    }

    public function detailRegister()
    {
        return Response::api('Success Load Data', ['amount' => (int) env('REGISTER_AMOUNT')]);
    }

    public function joinAdmin(Request $request)
    {
        $update = [
            'current_agency' => $request->current_agency,
            'current_job' => $request->current_job,
            'organizational_experience' => $request->organizational_experience,
        ];
        $user = Admin::where('id', $request->auth->id)->first();

        $user->update($update);
        if (!$user) {
            return Response::apiError('Failed Update Profile', []);
        }

        $joinAdmin = [
            'user_id' => $request->auth->id,
        ];

        $create = JoinAdmin::updateOrCreate($joinAdmin);

        return Response::api('Permintaan telah dikirm', $create);
    }

    public function create(Request $req)
    {
        $password = Common::generateRandomString();
        $city = Cities::find($req->city);
        $admin = Admin::find($req->auth->id);
        if ($req->role == 0) {
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,
                'status' => 1,
                'provinces_id' => null,
                'cities_id' => null,
                'commission_id' => null,
                'organitation_parent_id' => null,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
                'password' => Hash::make($password),
            ];
        } elseif ($req->role == 1) {
            $this->validate($req, [
                'organitation_parent_id' => 'required',
            ]);
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,
                'status' => 1,
                'provinces_id' => null,
                'cities_id' => null,
                'commission_id' => null,
                'organitation_parent_id' => $req->organitation_parent_id,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
                'password' => Hash::make($password),
            ];
        } elseif ($req->role == 2) {
            $this->validate($req, [
                'provinces_id' => 'required',
                'organitation_parent_id' => 'required',
            ]);
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,
                'status' => 1,
                'provinces_id' => $req->provinces_id,
                'cities_id' => null,
                'commission_id' => null,
                'organitation_parent_id' => $req->organitation_parent_id,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
                'password' => Hash::make($password),
            ];
        } elseif ($req->role == 3) {
            $this->validate($req, [
                'cities_id' => 'required',
                'organitation_parent_id' => 'required',
            ]);
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,
                'status' => 1,
                'provinces_id' => null,
                'cities_id' => $req->cities_id,
                'commission_id' => null,
                'organitation_parent_id' => $req->organitation_parent_id,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
                'password' => Hash::make($password),
            ];
        } elseif ($req->role == 4) {
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,
                'status' => 1,
                'provinces_id' => null,
                'cities_id' => null,
                'commission_id' => $req->commission_id,
                'organitation_parent_id' => $req->organitation_parent_id,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
                'password' => Hash::make($password),
            ];
        } else {
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,
                'status' => 1,
                'provinces_id' => $req->provinces_id,
                'cities_id' => null,
                'commission_id' => $req->commission_id,
                'organitation_parent_id' => $req->organitation_parent_id,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
                'password' => Hash::make($password),
            ];
        }

        $admin = Admin::where('email', $req->email)->first();
        if ($admin) {
            return Response::apiError('Admin sudah terdaftar', []);
        } else {
            $admin = Admin::create($adminReq);
        }

        $sendMail = Mail::to($admin->email)
            ->template('email.admin_register_success', ['password' => $password, 'admin' => $admin])
            ->subject('Penunjukan Admin')
            ->Send();

        return Response::api('Create App Succsess', $admin);
    }

    public function update($id, Request $req)
    {
        $this->validate($req, [
            'email' => 'unique:admins,email,'.$id,
            'role' => function ($attribute, $value, $fail) use ($req) {
                $role_list = collect(Admin::roleList())->pluck('value')->toArray();
                if (!in_array($value, $role_list)) {
                    $fail('Role Invalid');
                }
            },
            'organitation_parent_id' => [function ($attribute, $value, $fail) use ($req) {
                if ($req->role != 0) {
                    if (is_null($value) || $value == '') {
                        $fail('The organitation parent id field is required.');
                    } else {
                        $organitation_parent = MasterOrganitationParent::find($value);
                        if (is_null($organitation_parent)) {
                            $fail('The selected organitation parent id is not registered.');
                        }
                    }
                }
            }],
        ]);

        if ($req->role == 0) {
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,

                'provinces_id' => null,
                'cities_id' => null,
                'commission_id' => null,
                'organitation_parent_id' => null,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
            ];
        } elseif ($req->role == 1) {
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,

                'provinces_id' => null,
                'cities_id' => null,
                'commission_id' => null,
                'organitation_parent_id' => $req->organitation_parent_id,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
            ];
        } elseif ($req->role == 2) {
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,

                'provinces_id' => $req->provinces_id,
                'cities_id' => null,
                'commission_id' => null,
                'organitation_parent_id' => $req->organitation_parent_id,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
            ];
        } elseif ($req->role == 3) {
            $this->validate($req, [
                'cities_id' => 'required',
            ]);
            $city = Cities::find($req->city);

            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,

                'provinces_id' => null,
                'cities_id' => $req->cities_id,
                'commission_id' => null,
                'organitation_parent_id' => $req->organitation_parent_id,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
            ];
        } elseif ($req->role == 4) {
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,

                'provinces_id' => null,
                'cities_id' => null,
                'commission_id' => $req->commission_id,
                'organitation_parent_id' => $req->organitation_parent_id,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
            ];
        } else {
            $adminReq = [
                'name' => $req->name,
                'role' => $req->role,

                'provinces_id' => $req->provinces_id,
                'cities_id' => null,
                'commission_id' => $req->commission_id,
                'organitation_parent_id' => $req->organitation_parent_id,
                'email' => $req->email,
                'phone_number' => $req->phone_number,
            ];
        }

        $admin = Admin::find($id);
        $admin->name = $adminReq['name'];
        $admin->role = $adminReq['role'];
        $admin->provinces_id = $adminReq['provinces_id'];
        $admin->cities_id = $adminReq['cities_id'];
        $admin->organitation_parent_id = $adminReq['organitation_parent_id'];
        $admin->email = $adminReq['email'];
        $admin->phone_number = $adminReq['phone_number'];
        $admin->save();

        return Response::api('Admin Update Success', $admin);
    }

    public function changePassword(Request $request)
    {
        $update = [
            'password' => Hash::make($request->password),
        ];

        $admin = Admin::where('id', $request->auth->id)->first();
        if (Hash::check($request->old_password, $admin->password)) {
            $admin->update($update);
            if (!$admin) {
                return Response::apiError('Failed Update Profile', []);
            }

            return Response::api('Update Profile Success', $admin);
        } else {
            return Response::apiError('password lama salah', []);
        }
    }

    public function profile(Request $request)
    {
        $user_id = $request->auth->id;
        $user = Admin::find($user_id);
        if (!$user) {
            return Response::apiError('Not Found Admin', $user);
        }

        $province = (object) [];
        $city = (object) [];
        $district = (object) [];
        $village = (object) [];
        if (!empty($user->provinces_id)) {
            $province = Province::find($user->provinces_id);
        }
        if (!empty($user->cities_id)) {
            $city = Cities::find($user->cities_id);
        }
        if (!empty($user->districts_id)) {
            $district = District::find($user->districts_id);
        }
        if (!empty($user->villages_id)) {
            $village = Village::find($user->villages_id);
        }
        $user->province = $province;
        $user->city = $city;
        $user->district = $district;
        $user->village = $village;
        $user->profession = '';
        $user->is_profile_completed = Admin::isProfileCompleted($user);

        return Response::api('Success Load Data Profile', $user);
    }

    public function profileJoinAdmin(Request $request)
    {
        $user_id = $request->auth->id;
        $user = Admin::find($user_id);
        if (!$user) {
            return Response::apiError('Not Found Admin', $user);
        }

        $joinAdmin = JoinAdmin::where('user_id', $user_id)->first();
        $status = isset($joinAdmin->status) ? $joinAdmin->status : -1;
        $res = (object) [
            'current_agency' => $user->current_agency,
            'organizational_experience' => $user->organizational_experience,
            'status_code' => $status,
            'status_text' => JoinAdmin::statusText($status),
        ];

        return Response::api('Success Load Data', $res);
    }

    /** List */
    public function list(Request $request)
    {
        $perPage = env('TOTAL_PER_PAGE', 20);
        if ($request->limit) {
            $perPage = $request->limit;
        }
        $sort = Admin::sortedValue($request->sort_key, $request->sort_condition);
        $search = '%'.$request->search.'%';

        $Data = Admin::where(function ($query) use ($search) {
            $query->orWhere('name', 'like', $search);
            $query->orWhere('email', 'like', $search);
        })
        ->orderBy($sort->key, $sort->condition);

        if($request->auth->identity == 'admin')
        {
            switch ($request->auth->role)
            {
                case 1:
                    $Data = $Data->whereIn('role', [1,2,3]);
                    break;
                case 2:
                    $Data = $Data->whereIn('role', [2,3]);
                    break;
                case 3:
                    $Data = $Data->where('role', 3);
                    break;
            }

            $admin = Admin::find($request->auth->id);
            if($request->auth->role >= 1 && $request->auth->role <= 3)
                $Data = $Data->where('organitation_parent_id', $admin->organitation_parent_id);
        }

        $Data = $Data->paginate($perPage);

        if (!$Data) {
            return Response::apiError('Not found data', []);
        }

        for ($i = 0; $i < count($Data); ++$i) {
            $Data[$i]['status_label'] = Admin::statusLabel($Data[$i]['status']);

            $province = (object) [];
            $city = (object) [];
            $organitation_parent = (object) [];
            if (!empty($Data[$i]['provinces_id'])) {
                $province = Province::find($Data[$i]['provinces_id']);
            }
            if (!empty($Data[$i]['cities_id'])) {
                $city = Cities::find($Data[$i]['cities_id']);
            }
            if (!empty($Data[$i]['organitation_parent_id'])) {
                $organitation_parent = MasterOrganitationParent::find($Data[$i]['organitation_parent_id']);
            }
            $Data[$i]['province'] = $province;
            $Data[$i]['city'] = $city;
            $Data[$i]['organitation_parent'] = $organitation_parent;
        }
        $res = [
            'result' => $Data,
            'roles' => Admin::roleList(),
        ];

        return Response::api('Load member success', $res);
    }

    /** List */
    public function Rolelist(Request $request)
    {
        $rolesList = collect(Admin::roleList());
        switch ($request->auth->role)
        {
            case 1:
                $rolesList = $rolesList->filter(function($value){
                    return in_array($value['value'], [1,2,3]);
                });
                break;
            case 2:
                $rolesList = $rolesList->filter(function($value){
                    return in_array($value['value'], [2,3]);
                });
                break;
            case 3:
                $rolesList = $rolesList->filter(function($value){
                    return $value['value'] == 3;
                });
                break;
        }

        return Response::api('Load member success', $rolesList->values()->all());
    }

    /** Detail Admin */
    public function detailAdmin($id)
    {
        $admin = Admin::where('id', $id)->first();
        $province = (object) [];
        $city = (object) [];
        $district = (object) [];
        $parent = (object) [];
        $village = (object) [];
        if (!empty($admin->organitation_parent_id)) {
            $parent = MasterOrganitationParent::find($admin->organitation_parent_id);
        }
        if (!empty($admin->provinces_id)) {
            $province = Province::find($admin->provinces_id);
        }
        if (!empty($admin->cities_id)) {
            $city = Cities::find($admin->cities_id);
        }
        if (!empty($admin->districts_id)) {
            $district = District::find($admin->districts_id);
        }
        if (!empty($admin->villages_id)) {
            $village = Village::find($admin->villages_id);
        }

        $admin->status_label = Admin::statusLabel($admin->status);
        $admin->province = $province;
        $admin->city = $city;
        $admin->district = $district;
        $admin->village = $village;
        $admin->organitation_parent = $parent;

        return Response::api('Load member succsess', $admin);
    }

    /** List Admin */
    public function listJoinAdmin(Request $request)
    {
        $perPage = env('TOTAL_PER_PAGE', 20);
        $search = '%'.$request->search.'%';
        $sort = Admin::sortedValue($request->sort_key, $request->sort_condition);
        $data = joinAdmin::join('users', 'join_admin.user_id', '=', 'users.id')
            ->where(function ($query) use ($search) {
                $query->orWhere('users.name', 'like', $search);
                $query->orWhere('users.email', 'like', $search);
            })->orderBy('users.'.$sort->key, $sort->condition)->paginate($perPage);

        if (!$data) {
            return Response::apiError('Not found data', []);
        }

        for ($i = 0; $i < count($data); ++$i) {
            $data[$i]['user'] = Admin::find($data[$i]['user_id']);
        }

        return Response::api('Load admin success', $data);
    }

    public function export(Request $request){
      

        $Data = Admin::orderBy('created_at', 'DESC');
        if($request->auth->identity == 'admin')
        {
            switch ($request->auth->role)
            {
                case 1:
                    $Data = $Data->whereIn('role', [1,2,3]);
                    break;
                case 2:
                    $Data = $Data->whereIn('role', [2,3]);
                    break;
                case 3:
                    $Data = $Data->where('role', 3);
                    break;
            }

            $admin = Admin::find($request->auth->id);
            if($request->auth->role >= 1 && $request->auth->role <= 3)
                $Data = $Data->where('organitation_parent_id', $admin->organitation_parent_id);
        }

        $Data = $Data->get();
        $Data = $Data->toArray();
        if (!$Data) {
            return Response::apiError('Not found data', []);
        }

        for ($i = 0; $i < count($Data); ++$i) {
            $Data[$i]['status_label'] = Admin::statusLabel($Data[$i]['status']);

            $province = (object) [];
            $city = (object) [];
            $organitation_parent = (object) [];
            if (!empty($Data[$i]['provinces_id'])) {
                $province = Province::find($Data[$i]['provinces_id']);
            }
            if (!empty($Data[$i]['cities_id'])) {
                $city = Cities::find($Data[$i]['cities_id']);
            }
            if (!empty($Data[$i]['organitation_parent_id'])) {
                $organitation_parent = MasterOrganitationParent::find($Data[$i]['organitation_parent_id']);
            }
            $Data[$i]['province'] = $province->name ?? '';
            $Data[$i]['city'] = $city->name ?? '';
            $Data[$i]['organitation_parent'] = $organitation_parent->name ?? '';
        }
       

        $header = [
            'Nama',
            'Email',
            'Wilayah',
            'Induk Olahraga',
        ];
        ini_set('memory_limit','256M');
        
        $path = 'storage/export/admin/' . $admin->id;
        $excelName = $admin->id . "_user_" . date('Ymdhis');
        
       
        Excel::create($excelName, function($excel) use ($Data, $header)
        {

            $excel->sheet('Sheet1', function($sheet) use ($Data, $header) {
                $row = 1;
                $sheet->getStyle('A1:D1')->applyFromArray([
                    'font' => [
                        'bold' => true
                    ]
                ]);
                $sheet->row($row, $header);

                foreach ($Data as $v)
                {
                    $row++;
                    $sheet->row($row, [
                        $v['name'],
                        $v['email'],
                        $v['province'],
                        $v['organitation_parent']
                    ]);
                }
            });

        })->store('xlsx', base_path('public/' . $path));

        return Response::api('Sukses', [
            'link_download' => url("$path/$excelName.xlsx"),
        ]);
        
    }
}
