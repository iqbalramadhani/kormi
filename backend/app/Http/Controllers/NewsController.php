<?php

namespace App\Http\Controllers;
use App\Admin;
use App\Http\Controllers\Traits\UploadFile;
use App\Library\ExportExcel;
use App\News;
use App\Library\Response;
use App\Library\Common;
use App\NewsFiles;
use App\NewsLike;
use App\User;
use Illuminate\Http\Request;
use App\Library\Asset;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\Library\Notification;

class NewsController extends BaseController
{
    use UploadFile;

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
        $wilayah = $req->wilayah;
        $organitationParentId = $req->organitation_parent_id;
        $trackLoc = Common::GetTrackLocation($req);
        $sort = News::sortedValue($req->sort_key,$req->sort_condition);
        $news = News::with(['organitationParent'])
                    ->select("news.*","admins.name as author", "cities.name as location_name")
                    ->withCount(["likes","comments"])
                    ->leftJoin("cities","news.location","=","cities.id")
                    ->join("admins","news.admin_id","=","admins.id")
                    ->where(function($query) use ($trackLoc){
                        if(!empty($trackLoc)){
                            foreach ($trackLoc as $key => $value) {
                                $query->orWhere("news.".$key,$value);
                            }
                        }
                    })
                    ->where(function($query) use ($search,$category,$status,$month,$year, $wilayah, $organitationParentId){

                    if(!empty($search))
                        $query->where("title","like","%".$search."%");
                    if(!empty($month))
                        $query->whereMonth("news.created_at",$month);
                    if(!empty($year))
                        $query->whereYear("news.created_at",$year);

                    if(!empty($wilayah))
                        $query->where("news.location",$wilayah);

                    if(!empty($organitationParentId))
                        $query->where("news.organitation_parent_id",$organitationParentId);

                    if(!empty($status)){
                        if($status == "publish")
                            $query->where("news.is_publish",1);
                        if($status == "unpublish")
                            $query->where("news.is_publish",0);
                    }

                    if(!empty($category) && $category != "all"){
                        $query->where("news.category",$category);
                    }
                   })
                    ->orderBy("news.".$sort->key,$sort->condition);

        if($req->auth->identity == 'user')
        {
            $user = User::find($req->auth->id);
            switch ($req->type) {
                case "populer":
                    $news = $news->withCount('likes')
                        ->where('news.organitation_parent_id', $user->organitation_parent_id)
                        ->orWhere('admins.role', 7)
                        ->orderBy('likes_count', 'desc');
                    break;
                case "organisasi_induk":
                    $news = $news->where('news.organitation_parent_id', $user->organitation_parent_id);
                    break;
                case "kormi":
                    $news = $news->where('admins.role', 7);
                    break;
                default:
                    $news = $news->where('news.organitation_parent_id', $user->organitation_parent_id);
            }
        }

        if($req->auth->identity == 'admin')
        {
            $admin = Admin::find($req->auth->id);
            if($req->auth->role >= 1 && $req->auth->role <= 3)
                $news = $news->where('news.organitation_parent_id', $admin->organitation_parent_id);
        }

        $news = $news->paginate($perPage);

        $publishCount = News::where('is_publish',1)->where(function($query) use ($trackLoc){
            if(!empty($trackLoc)){
                foreach ($trackLoc as $key => $value) {
                    $query->orWhere("news.".$key,$value);
                }
            }
        })->count();
        $draftCount = News::where('is_publish',0)->where(function($query) use ($trackLoc){
            if(!empty($trackLoc)){
                foreach ($trackLoc as $key => $value) {
                    $query->orWhere("news.".$key,$value);
                }
            }
        })->count();
        $count["draft"] = $draftCount;
        $count["publish"] = $publishCount;
        $res = array(
            "specific_count" => $count,
            "record" => $news
        );
        return Response::api("Load News Succsess",$res);
    }

    public function category(Request $req)
    {
        $newsCategory = News::category();

        return Response::api("Load News Succsess",$newsCategory);
    }

    public function detail($id, Request $req)
    {
        $news = News::select("news.*","admins.name as author", "cities.name as location_name")
        ->leftJoin("cities","news.location","=","cities.id")
        ->join("admins","news.admin_id","=","admins.id")
            ->with('newsFiles')
            ->where("news.id",$id)
            ->withCount('comments')
            ->withCount('likes');

        if($req->auth->identity == 'user'){
            $userId = $req->auth->id;
            $news = $news->selectSub(NewsLike::selectRaw('count(*)')->where('news_id', $id)->where('user_id', $userId), 'user_like');
        }
        $news = $news->first();
        return Response::api("Load News Succsess",$news);
    }

    public function update($id, Request $req)
    {

        $validator = Validator::make($req->all(), [
            "title" => "required",
            "description" => "required",
            "video_url" => "url",
            "gallery" => "image|array|max:5"
        ]);

        $validator->setAttributeNames($this->getAttributeValidation());

        if($validator->fails())
            return Response::apiError('Data tidak valid', $validator->errors());

        $location = $req->auth->show_data_location && !empty($req->auth->show_data_location) ? $req->auth->show_data_location : "0";

        $news = News::where("id",$id)->first();
        if(!$news || ($news && $location != $news->show_for_location)){
            return Response::apiError("Not Found News",(object)[],404);
        }

        try{
            $imagePathName = Asset::setPath("cms","news",$news->id.".png","admin");
            $image = Asset::uploadImage($imagePathName, $req->file('image'));

            $news->title = $req->title;
            $news->description = $req->description;
            $news->tags = $req->tags;
            $news->location = $req->location;
            $news->video_url =  $req->video_url;

             if(!empty($req->is_publish)){
                 if($req->is_publish != $news->is_publish)
                     $news->publish_time = date('Y-m-d H:i:s');
                 $news->is_publish = 1;
             }else{
                 $news->publish_time = null;
                 $news->is_publish = 0;
             }
            $news->category = News::category($req->category) ? $req->category : News::category("default");

            if(!empty($image)){
                $news->image = $image;
            }

            $news->save();

            if($galleries = $req->file('galleries'))
            {
                foreach ($galleries as $gallery)
                {
                    if(!$gallery)
                        continue;
                    $imageGallery = $gallery ? $this->uploadFile($gallery, "cms/news") : null;
                    NewsFiles::create([
                        'news_id' => $news->id,
                        'file' => $imageGallery,
                        'type' => strtok($gallery->getClientMimeType(), '/')
                    ]);
                }
            }

            if($deleteGalleries = $req->get("delete_galleries")) {
                $toBeDelete = NewsFiles::whereIn("id", $deleteGalleries)->where("news_id", $news->id)->get();
                foreach ($toBeDelete as $item) {
                    $this->deleteFile($item->file);
                    $item->delete();
                }
            }
        }
        catch (\Exception $e) {
            Log::error("update data news: " . $e->getMessage());
            return Response::apiError("Sedang terjadi kendala pada server coba beberapa saat lagi", []);
        }

        $news->load('newsFiles');
        return Response::api("Update News Succsess",$news);
    }

    public function published($id, Request $req)
    {
        $news = News::where("id",$id)->first();
        if(!$news){
            return Response::apiError("Not Found News",$news,404);
        }

        if(!empty($req->is_publish)){
            if($req->is_publish != $news->is_publish)
                $news->publish_time = date('Y-m-d H:i:s');

            $news->is_publish = 1;
        }
        else{
            $news->publish_time = null;
            $news->is_publish = 0;
        }

        $update = $news->save();

        if($update)
            return Response::api("Update News Succsess",$news);
    }

    public function create(Request $req)
    {
        $validator = Validator::make($req->all(), [
            "title" => "required",
//            "description" => "required",
            "video_url" => "url",
            "location" => "exists:cities,id",
            "galleries" => "array|max:5",
            "galleries.*" => "mimes:jpg,jpeg,png"
        ]);
        $validator->setAttributeNames($this->getAttributeValidation());

        if($validator->fails())
            return Response::apiError('Data tidak valid', $validator->errors());

        $admin = Admin::find($req->auth->id);

        $organisasiInduk = $admin->organitation_parent_id;

        try{
            $imagePathName = Asset::setPath("cms","news",time().".png","admin");
            $image = Asset::uploadImage($imagePathName, $req->file('image'));
            $news = array(
                "title" => $req->title,
                "description" => $req->description,
                "tags" => $req->tags,
                "image" => $image,
                "location" => $req->location,
                "video_url" => $req->video_url,
                "show_for_location" => $req->auth->show_data_location && !empty($req->auth->show_data_location) ? $req->auth->show_data_location : "0",
                "admin_id" => $req->auth->id,
                "organitation_parent_id" => $organisasiInduk ?? 0,
                "category" => News::category($req->category) ? $req->category : News::category("default")
            );

            $news["is_publish"] = $req->is_publish ?: 0;
            $news["publish_time"] = date('Y-m-d H:i:s');
            $create = News::create($news);

            if($galleries = $req->file('galleries'))
            {
                foreach ($galleries as $gallery)
                {
                    if(!$gallery)
                        continue;
                    $imageGallery = $gallery ? $this->uploadFile($gallery, "cms/news") : null;
                    NewsFiles::create([
                        'news_id' => $create->id,
                        'file' => $imageGallery,
                        'type' => strtok($gallery->getClientMimeType(), '/')
                    ]);
                }
            }
        }
        catch (\Exception $e) {
            Log::error($e->getMessage());
            return Response::apiError("Terjadi kendala terhadap server, coba beberapa saat lagi", []);
        }

        $create->load('newsFiles');
        Notification::send('news',[env("NOTIFICATION_PUBLIC_TAG")],$create->title,"news_detail",$create->id,false,true, "KORMI NEWS");

        return Response::api("Update News Succsess", $create);
    }

    public function testNotif()
    {
        $res = Notification::send('news',[env("NOTIFICATION_PUBLIC_TAG")],"ini pesan nya nanti yaaa","news_detail",1,false,true, "KORMI NEWS");
        return Response::api("sen notif",$res);
    }

    public function delete(Request $req, $id)
    {
        $news = News::find($id);
        $location = $req->auth->show_data_location && !empty($req->auth->show_data_location) ? $req->auth->show_data_location : "0";

        if(!$news || ($news && $location != $news->show_for_location)){
            return Response::apiError("Not Found News",(object)[],404);
        }

        $delete = $news->delete();
 
        if($delete){    
            return Response::api("Delete News Succsess", $news);
        }

        return Response::apiError("ID tidak valid", []);
    }

    private function getAttributeValidation()
    {
        return [
            'title' => "Nama Berita",
            'description' => "Text editor",
            'image' => "Foto utama berita",
            'video_url' => "Link video",
        ];
    }

    public function export(Request $req)
    {
        $url = '';
        $search = $req->search;
        $category = $req->category;
        $status = $req->status;
        $month = $req->month;
        $year = $req->year;
        $sort = News::sortedValue($req->sort_key,$req->sort_condition);
        $news = News::with('organitationParent')->select("news.*","admins.name as author", "cities.name as location_name")
            ->leftJoin("cities","news.location","=","cities.id")
            ->join("admins","news.admin_id","=","admins.id")
            ->where(function($query) use ($search,$category,$status,$month,$year){
                if(!empty($search))
                    $query->where("title","like","%".$search."%");
                if(!empty($month))
                    $query->whereMonth("news.created_at",$month);
                if(!empty($year))
                    $query->whereYear("news.created_at",$year);
                if(!empty($status)){
                    if($status == "publish")
                        $query->where("news.is_publish",1);
                    if($status == "unpublish")
                        $query->where("news.is_publish",0);
                }
                if(!empty($category) && $category != "all"){
                    $query->where("news.category",$category);
                }
            })
            ->orderBy("news.".$sort->key,$sort->condition);

        if($req->auth->identity == 'admin')
        {
            $admin = Admin::find($req->auth->id);
            if($req->auth->id >= 1 && $req->auth->id <= 3)
                $news = $news->where('news.organitation_parent_id', $admin->organitation_parent_id);
        }

        $news = $news->get();
        $header = [
            'TITLE' => 'title',
            'TAGS' => 'tags',
            'ORGANISASI INDUK' => 'oraganisasi_induk',
            'DIBUAT OLEH' => 'author',
        ];

        $export = new ExportExcel($header, $news, "news_" . date("YmdHis"), $path = 'storage/export/news', $ext = 'xlsx');

        $result = $export->export();

        return Response::api('sukses', [
            "file" => $result['url'],
        ]);
    }

    public function deleteImage($id) {

        $news = News::find($id);
        try{
            Asset::deleteImage($news->image);
            $news->image = null;
            $news->save();
        }
        catch (\Exception $e) {
            Response::apiError("Coba beberapa saat lagi", []);
        }

        $news->load('newsFiles');
        return Response::api("sukses mengahpus image", $news);
    }

    public function deleteGallery($id)
    {
        $newsFile = NewsFiles::find($id);
        if($newsFile)
        {
            $this->deleteFile($newsFile->file);
            $newsFile->delete();

            return Response::api("File sudah dihapus", []);
        }

        return Response::apiError("ID tidak valid", []);
    }

}
