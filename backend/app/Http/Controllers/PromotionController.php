<?php

namespace App\Http\Controllers;
use App\Promotion;
use App\Library\Response;
use Illuminate\Http\Request;
use App\Library\Notification;
use App\Library\Asset;
use Laravel\Lumen\Routing\Controller as BaseController;

class PromotionController extends BaseController
{

    public function __construct(Request $request)
    {
        $this->_validation($request);
    }

    private function _validation($request){
        $app_id = isset($request->auth->app_id) ? $request->auth->app_id : "";
        $data = array(
            "update" => array(
                        'title' => 'required|max:255',
                        ),
            "create" => array(
                        'title' => 'required|max:255',
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
        $category = $req->category;
        $status = $req->status;
        $month = $req->month;
        $year = $req->year;
        $sort = Promotion::sortedValue($req->sort_key,$req->sort_condition);
        $promotion = Promotion::select("promotions.*","users.name as author", "cities.name as city_name")
                ->leftJoin("cities","promotions.cities_id","=","cities.id")
                ->join("users","promotions.user_id","=","users.id")->where(function($query) use ($search,$category,$status,$month,$year){
                    if(!empty($search))
                        $query->where("title","like","%".$search."%");
                    if(!empty($month))
                        $query->whereMonth("promotions.created_at",$month);
                    if(!empty($year))
                        $query->whereYear("promotions.created_at",$year);
                    if(!empty($status)){
                        if($status == "publish")
                            $query->where("promotions.is_publish",1);
                        if($status == "unpublish")
                            $query->where("promotions.is_publish",0);
                    }
                    if(!empty($category) && $category != "all"){
                        $query->where("promotions.category",$category);
                    }
                   })->orderBy("promotions.".$sort->key,$sort->condition)->paginate($perPage);
        $draftCount = Promotion::where('is_publish',0)->count();
        $publishCount = Promotion::where('is_publish',1)->count();
        $count["draft"] = $draftCount;
        $count["publish"] = $publishCount;
        $res = array(
            "specific_count" => $count,
            "record" => $promotion
        ); 
        return Response::api("Load Promotion Succsess",$res);
    }

    public function category(Request $req)
    {
        $promotionCategory = Promotion::category();
        
        return Response::api("Load Promotion Succsess",$promotionCategory);
    }

    public function detail($id, Request $req)
    {
        $promotion = Promotion::select("promotions.*","users.name as author", "cities.name as city_name")
        ->leftJoin("cities","promotions.cities_id","=","cities.id")
        ->join("users","promotions.user_id","=","users.id")->where("promotions.id",$id)->first();
        
        return Response::api("Load Promotion Succsess",$promotion);
    }

    public function update($id, Request $req)
    {
        $promotion = Promotion::where("id",$id)->first();
        if(!$promotion){
            return Response::apiError("Not Found Promotion",$promotion,404);
        }

        $promotion->title = $req->title;
        $promotion->description = $req->description;
        $promotion->tags = $req->tags;
        $promotion->location = $req->location;
        $promotion->terms = $req->terms;
        $promotion->cities_id = $req->cities_id;
        $promotion->expired = $req->expired ? $req->expired : null;

        if(!empty($req->is_publish)){
            if($req->is_publish != $promotion->is_publish)
                $promotion->publish_time = date('Y-m-d H:i:s');
            $promotion->is_publish = 1;
        }else{
            $promotion->publish_time = null;
            $promotion->is_publish = 0;
        }
        $promotion->category = Promotion::category($req->category) ? $req->category : Promotion::category("default");
        
        $imagePathName = Asset::setPath("cms","promotion",$promotion->id.".png","admin");
        $image = Asset::uploadImage($imagePathName, $req->file('image'));

        if(!empty($image)){
            $promotion->image = $image;
        }

        $update = $promotion->save();
        
        if($update)
            return Response::api("Update Promotion Succsess",$promotion);
    }

    public function published($id, Request $req)
    {
        $promotion = Promotion::where("id",$id)->first();
        if(!$promotion){
            return Response::apiError("Not Found Promotion",$promotion,404);
        }

        if(!empty($req->is_publish)){
            if($req->is_publish != $promotion->is_publish)
                $promotion->publish_time = date('Y-m-d H:i:s');
            
            $promotion->is_publish = 1;
        }
        else{
            $promotion->publish_time = null;
            $promotion->is_publish = 0;
        }

        $update = $promotion->save();
        
        if($update)
            return Response::api("Update Promotion Succsess",$promotion);
    }

    public function create(Request $req)
    {
        $imagePathName = Asset::setPath("cms","promotion",time().".png","admin");
        $image = Asset::uploadImage($imagePathName, $req->file('image'));

        $promotion = array("title" => $req->title,
                "description" => $req->description,
                "tags" => $req->tags,
                "image" => $image,
                "location" => $req->location,
                "terms" => $req->terms,
                "cities_id" => $req->cities_id ? $req->cities_id : null,
                "user_id" => $req->auth->id,
                "expired" => $req->expired ? $req->expired : null,
                "category" => Promotion::category($req->category) ? $req->category : Promotion::category("default"));

        if(!empty($req->is_publish)){
            $promotion["is_publish"] = 1;
            $promotion["publish_time"] = date('Y-m-d H:i:s');
        }
        else{
            $promotion["publish_time"] = null;
            $promotion["is_publish"] = 0;
        }
        $create = Promotion::create($promotion);
                    
        if($create){
            Notification::send('promotion',[env("NOTIFICATION_PUBLIC_TAG")],$create->title,"promotion_detail",$create->id,false,true,"KORMI PROMO");
            return Response::api("Update Promotion Succsess",$create);
        }
    }

    public function delete($id)
    {
        $promotion = Promotion::find($id);
        
        if(!$promotion){
            return Response::apiError("Not Found Promotion",$promotion,404);
        }
        
        $delete = $promotion->delete();
 
        if($delete){    
            return Response::api("Delete Promotion Succsess",$promotion);
        }
    }
}
