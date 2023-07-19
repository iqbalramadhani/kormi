<?php

namespace App\Http\Controllers;
use App\Province;
use App\Library\Response;
use Illuminate\Http\Request;
use App\Library\Asset;
use Laravel\Lumen\Routing\Controller as BaseController;

class ProvinceController extends BaseController
{

    public function __construct(Request $request)
    {
        $this->_validation($request);
        $this->model = new Province();
    }

    private function _validation($request){
        $app_id = isset($request->auth->app_id) ? $request->auth->app_id : "";
        $data = array(
            "store" => array(
                    'name' => 'required|unique:provinces',
                    ),
            "update" => array(
                    'name' => 'required|unique:provinces,name,'.$request->id,
                    )
        );
        
        if(array_key_exists(Response::function(), $data)){
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $request){
        $query = $this->model;
        $keyword = (isset($request->keyword) && !empty($request->keyword)) ? $request->keyword : "";
        $data = $query->where("name",'Like',"%".$keyword."%")->get();
        if($data->count() > 0){
            return Response::api("Success",$data);
        }             
        return Response::api("Empty Data",$data);
    }
    
    public function show($id){
        $data = $this->model->where('id',$id)->first();
        if($data){
            return Response::api("Success",$data);
        }             
        return Response::apiEmpty("Empty Data",$data);
    }
    
    public function store (Request $request){
        
        try {
            $data = $this->model->create($request->except('id'));
            if($data){
                return Response::api('Success Create Data',$data);
            }
        } catch (\Exception $e) {
            error_log(print_r(print_r($e->getMessage(),true),true));
            print_r(print_r($e->getMessage(),true));
            return Response::apiError();
        }   
    }

    public function update(Request $request, $id){
        try {
            $data = $this->model->find($id);
            if($data){
                $data->update($request->except('id'));
                return Response::api('Success Update Data',$data);
            }else{
                return Response::apiEmpty();   
            }
        } catch (\Exception $e) {
            error_log(print_r($e->getMessage(),true));
            return Response::apiError();
        }
    }
    
    public function destroy($id){
        try{
            $data = $this->model->where('id',$id)->first();
            if(!empty($data)){            
                $data->delete();
                if($data){
                    return Response::api('Success Delete Data',$data);
                }
            };
            return Response::apiEmpty("Not Found Data",null,400);
        } catch (\Exception $e) {
            error_log(print_r($e->getMessage(),true));
            return Response::apiError();
        }
    }
}
