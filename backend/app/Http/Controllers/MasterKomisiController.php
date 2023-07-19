<?php

namespace App\Http\Controllers;
use App\News;
use App\Library\Response;
use Illuminate\Http\Request;
use App\Library\Asset;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\Library\Notification;
use App\MasterKomisi;
use App\MasterStatusOrganisasi;

class MasterKomisiController extends BaseController
{

    public function __construct(Request $request)
    {
        $this->_validation($request);
    }

    private function _validation($request){
        $app_id = isset($req->auth->app_id) ? $req->auth->app_id : "";
        $data = array(
            "update" => array(
                        'commission_no' => 'required',
                        'commission_code' => 'required',
                        'commission_name' => 'required',
                        ),
            "create" => array(
                         'commission_no' => 'required',
                        'commission_code' => 'required',
                        'commission_name' => 'required',
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

        $news = MasterKomisi::where("id",$id)->first();
        if(!$news){
            return Response::apiError("Not Found Master Komisi",$news,404);
        }

       
        $news->commission_no = $req->title;
        $news->commission_code = $req->description;
        $news->commission_name = $req->tags;
       

       
       
        $update = $news->save();
        
        if($update)
            return Response::api("Update Master Komisi Succsess",$news);
    }

   
    public function detail($id, Request $req)
    {
        $news = MasterKomisi::select("master_komisi.*")
        ->where("master_komisi.id",$id)->first();
        
        return Response::api("Load Induk Organisasi Succsess",$news);
    }
    public function create(Request $req)
    {
       
        $news = array("commission_no" => $req->commission_no,
                "commission_code" => $req->commission_code,
                "commission_name" => $req->commission_name,
    );
       
        $create = MasterKomisi::create($news);
        return Response::api("Create Master Komisi Succsess",$create);
        // if($create){
        //     Notification::send('news',[env("NOTIFICATION_PUBLIC_TAG")],$create->title,"news_detail",$create->id,false,true, "MASATA NEWS");
        //     return Response::api("Update News Succsess",$create);
        // }
        return Response::api("Create Master Komisi Succsess",$create);
    }

    // public function testNotif()
    // {
    //     $res = Notification::send('news',[env("NOTIFICATION_PUBLIC_TAG")],"ini pesan nya nanti yaaa","news_detail",1,false,true, "MASATA NEWS");
    //     return Response::api("sen notif",$res);
    // }
    public function delete($id)
    {
        $news = MasterKomisi::find($id);
        
        if(!$news){
            return Response::apiError("Not Found Master Komisi",$news,404);
        }
        
        $delete = $news->delete();
 
        if($delete){    
            return Response::api("Delete Master Komisi Succsess",$news);
        }
    }
}
