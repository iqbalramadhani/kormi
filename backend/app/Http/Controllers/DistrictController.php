<?php

namespace App\Http\Controllers;
use App\District;
use App\Library\Response;
use Illuminate\Http\Request;
use App\Library\Asset;
use Laravel\Lumen\Routing\Controller as BaseController;

class DistrictController extends BaseController
{

    public function __construct(Request $request)
    {
        $this->_validation($request);
        $this->model = new District();
    }

    private function _validation($request){
        $app_id = isset($request->auth->app_id) ? $request->auth->app_id : "";
        $data = array(
            "store" => array(
                    'id' => 'required|unique:countries,id',
                    'district_id' => 'required|exists:districts,id',
                    'name' => 'required|unique:countries',
                    ),
            "update" => array(
                    'id' => 'required|unique:countries,id,'.$request->id,
                    'name' => 'required|unique:countries,name,'.$request->id,
                    'district_id' => 'required|exists:districts,id',
                    )
        );
        
        if(array_key_exists(Response::function(), $data)){
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $request){
        $query = $this->model->select('districts.*','cities.name as cities_name')->join('cities','districts.city_id','cities.id');
        if(isset($request->city_id)){
            $query->where('city_id',$request->city_id);
        }
        $keyword = (isset($request->keyword) && !empty($request->keyword)) ? $request->keyword : "";
        if(!empty($keyword)){
            $query->where("districts.name",'Like',"%".$keyword."%");
        }
        $data = $query->limit(50)->get();
        if($data->count() > 0){
            return Response::api("Success",$data);
        }             
        return Response::api("Empty Data",$data);
    }
    
    public function show($id){
        $data = $this->model->with('Cities')->where('id',$id)->first();
        if($data){
            return Response::api("Success",$data);
        }             
        return Response::apiEmpty("Empty Data",$data);
    }
    
    public function store (Request $request){
        try {
            $data = $this->model->create($request->all());
            if($data){
                return Response::api('Success Create Data',$data);
            }
        } catch (\Exception $e) {
            error_log(print_r($e->getMessage(),true));
            return Response::apiError();
        }   
    }

    public function update(Request $request, $id){
        try {
            $data = $this->model->find($id);
            if($data){
                $data->update($request->all());
                return Response::api('Success Update Data',$data);
            }else{
                return Response::apiEmpty("Not Found Data",null,400);   
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
