<?php

namespace App\Http\Controllers;
use App\Cities;
use App\Library\Response;
use Illuminate\Http\Request;
use App\Library\Asset;
use Laravel\Lumen\Routing\Controller as BaseController;

class CityController extends BaseController
{

    public function __construct(Request $request)
    {
        $this->_validation($request);
        $this->model = new Cities();
    }

    private function _validation($request){
        $app_id = isset($request->auth->app_id) ? $request->auth->app_id : "";
        $data = array(
            "store" => array(
                    'id' => 'required|unique:countries,id',
                    'province_id' => 'required|exists:provinces,id',
                    'name' => 'required|unique:countries',
                    ),
            "update" => array(
                    'id' => 'required|unique:countries,id,'.$request->id,
                    'name' => 'required|unique:countries,name,'.$request->id,
                    'province_id' => 'required|exists:provinces,id',
                    )
        );
        
        if(array_key_exists(Response::function(), $data)){
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $request){
        $query = $this->model->select('cities.*','provinces.name as province_name')->join('provinces','cities.province_id','provinces.id');
        if(isset($request->province_id))
            $query->where('province_id',$request->province_id);
        
        $keyword = (isset($request->keyword) && !empty($request->keyword)) ? $request->keyword : "";
        if(!empty($keyword)){
            $query->where("cities.name",'Like',"%".$keyword."%");
        }
        if($request->limit)
            $query->limit(50);
        $data =$query->get();
        if($data->count() > 0){
            if($request->selectedForm == 1){
                $list = [];
                foreach ($data as $key => $value) {
                    $list[] = ["value"=>$value->id, "label"=>$value->name];
                }
                $data = $list;
            }
            return Response::api("Success",$data);
        }             
        return Response::api("Empty Data",$data);
    }
    
    public function show($id){
        $data = $this->model->with('Province')->where('id',$id)->first();
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
