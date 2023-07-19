<?php

namespace App\Http\Controllers;
use App\News;
use App\Library\Response;
use Illuminate\Http\Request;
use App\Library\Asset;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\Library\Notification;
use App\MasterStatusOrganisasi;

class MasterStatusOrganisasiController extends BaseController
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
                       // 'category' => 'required',
                        ),
            "create" => array(
                        'title' => 'required|max:255',
                        'description' => 'required',
                       // 'category' => 'required',
                        ),
        );
        
        if(array_key_exists(Response::function(), $data)){
            $this->validate($request, $data[Response::function()]);
        }
    }

    public function index(Request $req)
    {
        // $perPage = env('TOTAL_PER_PAGE', 20);
        // if($req->limit){
        //     $perPage = $req->limit;
        // }
        // $search = $req->search;
        // $category = $req->category;
        // $status = $req->status;
        // $month = $req->month;
        // $year = $req->year;
        // $sort = News::sortedValue($req->sort_key,$req->sort_condition);
        // $news = News::select("news.*","admins.name as author", "cities.name as location_name")
        //             ->leftJoin("cities","news.location","=","cities.id")
        //             ->join("admins","news.user_id","=","admins.id")->where(function($query) use ($search,$category,$status,$month,$year){
        //             if(!empty($search))
        //                 $query->where("title","like","%".$search."%");
        //             if(!empty($month))
        //                 $query->whereMonth("news.created_at",$month);
        //             if(!empty($year))
        //                 $query->whereYear("news.created_at",$year);
        //             if(!empty($status)){
        //                 if($status == "publish")
        //                     $query->where("news.is_publish",1);
        //                 if($status == "unpublish")
        //                     $query->where("news.is_publish",0);
        //             }
        //             if(!empty($category) && $category != "all"){
        //                 $query->where("news.category",$category);
        //             }
        //            })->orderBy("news.".$sort->key,$sort->condition)->paginate($perPage);
        // $draftCount = News::where('is_publish',0)->count();
        // $publishCount = News::where('is_publish',1)->count();
        // $count["draft"] = $draftCount;
        // $count["publish"] = $publishCount;
        // $res = array(
        //     "specific_count" => $count,
        //     "record" => $news
        // ); 
        // return Response::api("Load News Succsess",$res);
    }

   
   
    public function update($id, Request $req)
    {

        $news = MasterStatusOrganisasi::where("id",$id)->first();
        if(!$news){
            return Response::apiError("Not Found News",$news,404);
        }

       
        $news->title = $req->title;
        $news->description = $req->description;
        // $news->tags = $req->tags;
        // $news->location = $req->location;

       
       
        $update = $news->save();
        
        if($update)
            return Response::api("Update Master Status Organisasi Succsess",$news);
    }

   

    public function create(Request $req)
    {
       
        $news = array("title" => $req->title,
                "description" => $req->description,
    );
       
        $create = MasterStatusOrganisasi::create($news);
        return Response::api("Update Master Status Organisasi Succsess",$create);
        // if($create){
        //     Notification::send('news',[env("NOTIFICATION_PUBLIC_TAG")],$create->title,"news_detail",$create->id,false,true, "MASATA NEWS");
        //     return Response::api("Update News Succsess",$create);
        // }
        return Response::api("Update Master Status Organisasi Succsess",$create);
    }

    // public function testNotif()
    // {
    //     $res = Notification::send('news',[env("NOTIFICATION_PUBLIC_TAG")],"ini pesan nya nanti yaaa","news_detail",1,false,true, "MASATA NEWS");
    //     return Response::api("sen notif",$res);
    // }
    public function detail($id, Request $req)
    {
        $news = MasterStatusOrganisasi::select("master_status_organisasi.*")
        ->where("master_status_organisasi.id",$id)->first();
        
        return Response::api("Load Induk Organisasi Succsess",$news);
    }
    public function delete($id)
    {
        $news = MasterStatusOrganisasi::find($id);
        
        if(!$news){
            return Response::apiError("Not Found Master Status Organisasi",$news,404);
        }
        
        $delete = $news->delete();
 
        if($delete){    
            return Response::api("Delete Master Status Organisasi Succsess",$news);
        }
    }
}
