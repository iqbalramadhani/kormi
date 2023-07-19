<?php


namespace App\Http\Controllers;


use App\Category;
use App\Http\Controllers\Interfeces\CRUDMasterInterface;
use App\Http\Controllers\Traits\CRUDMaster;
use App\Library\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Lumen\Routing\Controller;

class CategoryController extends Controller
{
    protected $perPage = 2;

    protected $rules = [
        'name' => 'required',
    ];

    public function index(Request $request)
    {
        $categories = new Category;

        if($request->has('name'))
        {
            $categories = $categories->where('name', 'like', "%{$request->get('name')}%");
        }

        $categories = $categories->paginate($this->perPage);

        return Response::api("data berhasil diambil", [
            'categories' => $categories
        ]);
    }

    public function createOrUpdate(Request $request, $id = null)
    {
        $validator = Validator::make($request->all(), $this->rules);

        if($validator->fails())
        {
            return Response::apiError($validator->errors()->first(), [
                'errors' => $validator->errors()
            ]);
        }

        $category = new Category();
        if($request->isMethod('put'))
            $category = Category::find($id);

        $category->name = $request->get('name');

        $category->save();

        return Response::api("data berhasil disimpan", ['category' => $category]);
    }

    public function delete(Request $request, $id)
    {
        if(!$id){
            return Response::apiError("id tidak valid");
        }

        Category::destroy($id);

        return Response::api("data berhasil dihapus", []);
    }

    public function show(Request $request, $id)
    {
        if(!$id){
            return Response::apiError("id tidak valid");
        }

        $category = Category::find($id);

        return Response::api("data berhasil diambil", ['category' => $category]);
    }
}
