<?php

namespace App\Http\Controllers;
use App\Library\Response;
use Illuminate\Http\Request;
use App\Library\Asset;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\MasterOrganitationStatus;

class MasterOrganitationStatusController extends BaseController
{

    public function __construct(Request $request)
    {
        $this->_validation($request);
    }

    private function _validation($request){
        $app_id = isset($req->auth->app_id) ? $req->auth->app_id : "";
        $data = array(
            "update" => array(
                        'title' => 'required|max:255',
                        'description' => 'required',
                        ),
            "create" => array(
                        'title' => 'required|max:255',
                        'description' => 'required',
                        ),
        );
        
        if(array_key_exists(Response::function(), $data)){
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $req)
    {
        $perPage = env('TOTAL_PER_PAGE', 20);
        if($req->limit){
            $perPage = $req->limit;
        }
        $search = $req->search;
        $sort = MasterOrganitationStatus::sortedValue($req->sort_key,$req->sort_condition);
        $res = MasterOrganitationStatus::where(function($query) use ($search){
                    if(!empty($search))
                        $query->where("title","like","%".$search."%");
                    })->orderBy($sort->key,$sort->condition)->paginate($perPage);
        return Response::api("Load News Succsess",$res);
    }

   
   
    public function update($id, Request $req)
    {

        $status = MasterOrganitationStatus::where("id",$id)->first();
        if(!$status){
            return Response::apiError("Not Found News",$status,404);
        }

       
        $status->title = $req->title;
        $status->description = $req->description;
       
        $update = $status->save();
        
        if($update)
            return Response::api("Update Master Organitation Status Succsess",$status);
    }

   

    public function create(Request $req)
    {
       
        $status = array(
                    "title" => $req->title,
                    "description" => $req->description,
                );
       
        $create = MasterOrganitationStatus::create($status);
        if(!$create)
            return Response::apiError("Not Found Master Organitation Status",(object)[],404);
            
        return Response::api("Update Master Organitation Status Succsess",$create);
    }

    public function detail($id, Request $req)
    {
        $status = MasterOrganitationStatus::where("id",$id)->first();
        
        return Response::api("Load Induk Organisasi Succsess",$status);
    }
    public function delete($id)
    {
        $status = MasterOrganitationStatus::find($id);
        
        if(!$status){
            return Response::apiError("Not Found Master Organitation Status",$status,404);
        }
        
        $delete = $status->delete();
 
        if($delete){    
            return Response::api("Delete Master Organitation Status Succsess",$status);
        }
    }
}
