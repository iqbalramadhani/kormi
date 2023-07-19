<?php

namespace App\Http\Controllers;
use App\Admin;
use App\Event;
use App\EventFile;
use App\Http\Controllers\Traits\UploadFile;
use App\Library\ExportExcel;
use App\NewsFiles;
use App\EventComment;
use App\User;
use App\JoinEvent;
use App\EventPayment;
use App\Library\Response;
use Illuminate\Http\Request;
use App\Library\Notification;
use App\Library\Asset;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Laravel\Lumen\Routing\Controller as BaseController;
use Ramsey\Uuid\Uuid;
use App\Library\Curl;
use App\Library\Common;
use DB;

class EventController extends BaseController
{
    use UploadFile;

    public function __construct(Request $request)
    {
        $this->_validation($request);
    }

    private function _validation($request){
        $app_id = isset($request->auth->app_id) ? $request->auth->app_id : "";
        $data = array(
//            "update" => array(
//                        'title' => 'required|max:255',
//                        ),
//            "create" => array(
//                        'title' => 'required|max:255',
//                        ),
            "joinEvent" => array(
                'event_id' => 'required|exists:events,id',
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
        $wilayah = $req->wilayah;
        $organitationParentId = $req->organitation_parent_id;

        $trackLoc = Common::GetTrackLocation($req);
        $sort = Event::sortedValue($req->sort_key,$req->sort_condition);
        $event = Event::select("events.*","admins.name as author", "cities.name as location_name")
                    ->withCount(['comments as with_rating' => function($query){
                        $query->select(DB::raw('coalesce(avg(rate),0)'));
                    },'comments as count_rate' ])
                    ->leftJoin("cities","events.location","=","cities.id")->join("admins","events.admin_id","=","admins.id")
                    ->where(function($query) use ($trackLoc){
                        if(!empty($trackLoc)){
                            foreach ($trackLoc as $key => $value) {
                                $query->orWhere("events.".$key,$value);
                            }
                        }
                    })
                    ->where(function($query) use ($search,$category,$status,$month,$year, $wilayah, $organitationParentId){
                        if(!empty($search))
                            $query->where("title","like","%".$search."%");
                        if(!empty($month))
                            $query->whereMonth("events.created_at",$month);

                        if(!empty($year))
                            $query->whereYear("events.created_at",$year);

                        if(!empty($wilayah))
                            $query->where("events.location",$wilayah);

                        if(!empty($organitationParentId))
                            $query->where("events.organitation_parent_id",$organitationParentId);

                        if(!empty($status)){
                            if($status == "publish")
                                $query->where("events.is_publish",1);
                            if($status == "unpublish")
                                $query->where("events.is_publish",0);
                        }

                        if(!empty($category) && $category != "all"){
                            $query->where("events.category",$category);
                        }
                   })->orderBy("events.".$sort->key,$sort->condition);


        if($req->auth->identity == 'user')
        {
            $user = User::find($req->auth->id);
            switch ($req->type) {
                case "gratis":
                    $event = $event->where('events.price', 0)
                        ->where('events.organitation_parent_id', $user->organitation_parent_id);
                    break;
                case "terdekat":
                    $event = $event->where('events.location', $user->cities_id)
                        ->where('events.organitation_parent_id', $user->organitation_parent_id);
                    break;
                default:
                    $event = $event->where('events.organitation_parent_id', $user->organitation_parent_id);
                    break;
            }
            $event = $event->where('events.event_end_date', '>=', Carbon::now()->toDateTimeString());
        }

        if($req->auth->identity == 'admin')
        {
            $admin = Admin::find($req->auth->id);
            if($req->auth->role >= 1 && $req->auth->role <= 3)
                $event = $event->where('events.organitation_parent_id', $admin->organitation_parent_id);
        }

        $event = $event->with("organitationParent")->paginate($perPage);


        $draftCount = Event::where('is_publish',0)->where(function($query) use ($trackLoc){
            if(!empty($trackLoc)){
                foreach ($trackLoc as $key => $value) {
                    $query->orWhere("events.".$key,$value);
                }
            }
        })->count();
        $publishCount = Event::where('is_publish',1)->where(function($query) use ($trackLoc){
            if(!empty($trackLoc)){
                foreach ($trackLoc as $key => $value) {
                    $query->orWhere("events.".$key,$value);
                }
            }
        })->count();
        $count["draft"] = $draftCount;
        $count["publish"] = $publishCount;
        $res = array(
            "specific_count" => $count,
            "record" => $event
        );
        return Response::api("Load Event Succsess",$res);
    }

    public function category(Request $req)
    {
        $eventCategory = Event::category();

        return Response::api("Load Event Succsess",$eventCategory);
    }

    /** List Member */
    public function listMemberEvent($id, Request $request)
    {
        $perPage = env('TOTAL_PER_PAGE', 20);
        if ($request->limit) {
            $perPage = $request->limit;
        }
        $sort = User::sortedValue($request->sort_key,$request->sort_condition);
        $search = "%" . $request->search . "%";

        $Data = JoinEvent::select("users.*", "provinces.name as province_name", "cities.name as city_name")
            ->join('users','join_event.user_id', '=', 'users.id')
            ->leftJoin('provinces', 'provinces.id', 'provinces_id')
            ->leftJoin('cities', 'cities.id', 'cities_id')
            ->where(function ($query) use ($search) {
                $query->orWhere('users.name', "like", $search);
                $query->orWhere('users.email', "like", $search);
            })->where('join_event.event_id',$id)
            ->orderBy('users.'.$sort->key,$sort->condition)->paginate($perPage);

        if (!$Data)
            return Response::apiError("Not found data", []);

        return Response::api("Load member success", $Data);
    }

    public function detail($id, Request $req)
    {
        $admin_id = $req->auth ? $req->auth->id : 0;
        $event = Event::with('eventFiles')
            ->select("events.*","admins.name as author", "cities.name as location_name")
        ->leftJoin("cities","events.location","=","cities.id")
        ->join("admins","events.admin_id","=","admins.id")->where("events.id",$id);
        if($event && $req->auth && $req->auth->identity == "user"){
            $check_user_join = JoinEvent::where("user_id",$req->auth->id)->where("event_id",$id)->where("status",1)->first();
            $event->is_join = isset($check_user_join) && $check_user_join ? true : false;

            $event = $event->select("events.*", \DB::raw("(SELECT count(*) FROM event_comments
                          WHERE event_comments.user_id = ".$req->auth->id." and event_comments.event_id = events.id
                        ) as has_comment"));
        }

        $event = $event->first();
        if($event && $req->auth && $req->auth->identity == "user")
        {
            $check_user_join = JoinEvent::where("user_id", $req->auth->id)->where("event_id", $id)->where("status", 1)->first();
            $event->joint_event = $check_user_join;
            $event->is_join = isset($check_user_join) && $check_user_join ? true : false;
        }

        $eventRate = EventComment::where('event_id', $id)->avg('rate');
        $countRate = EventComment::where('event_id', $id)->where('status', 1)->count();

        $event->with_rating = (float) $eventRate ?? 0;
        $event->count_rate = $countRate;

        return Response::api("Load Event Succsess",$event);
    }

    public function update($id, Request $req)
    {
        $validator = Validator::make($req->all(), $this->getRules());

        $validator->setAttributeNames($this->getAttributeValidation());

        if($validator->fails())
            return Response::apiError('Data tidak valid', $validator->errors());

        $event = Event::where("id",$id)->first();
        $location = $req->auth->show_data_location && !empty($req->auth->show_data_location) ? $req->auth->show_data_location : "0";
        if(!$event || ($event && $location != $event->show_for_location)){
            return Response::apiError("Not Found Event",(object)[],404);
        }

        $event->title = $req->title;
        $event->description = $req->description;
        $event->tags = $req->tags;
        $event->location = $req->location;

        $event->end_registration = $req->end_registration ?? null;
        $event->start_registration = $req->start_registration ?? null;

        $event->price = $req->price ?? null;

        $event->event_date = $req->event_date ?? null;
        $event->event_end_date = $req->event_end_date ?? null;
        $event->webinar_url = $req->webinar_url ?? '';
        $event->type_id = $req->type_id;

//        $event->time_start = $req->time_start ?? null;
//        $event->time_end = $req->time_end ?? null;

        if(!empty($req->is_publish)){
            if($req->is_publish != $event->is_publish)
                $event->publish_time = date('Y-m-d H:i:s');
            $event->is_publish = 1;
        }else{
            $event->publish_time = null;
            $event->is_publish = 0;
        }

        $event->category = Event::category($req->category) ? $req->category : Event::category("default");

        $imagePathName = Asset::setPath("cms","event",$event->id.".png", "admin");
        $image = Asset::uploadImage($imagePathName, $req->file('image'));

        if(!empty($image)){
            $event->image = $image;
        }

        try{
            $event->save();

            if($galleries = $req->file('galleries'))
            {
                foreach ($galleries as $gallery)
                {
                    if(!$gallery)
                        continue;
                    $imageGallery = $gallery ? $this->uploadFile($gallery, "cms/event") : null;
                    EventFile::create([
                        'event_id' => $event->id,
                        'file' => $imageGallery,
                        'type' => strtok($gallery->getClientMimeType(), '/')
                    ]);
                }
            }

            if($deleteGalleries = $req->get("delete_galleries")) {
                $toBeDelete = EventFile::whereIn("id", $deleteGalleries)->where("event_id", $event->id)->get();
                foreach ($toBeDelete as $item) {
                    $this->deleteFile($item->file);
                    $item->delete();
                }
            }

            $event->load('eventFiles');
        }
        catch (\Exception $e) {
            Log::error("update event: " . $e->getMessage());
            return Response::apiError("Server sedang dalam kendala coba beberapa saat lagi", []);
        }

        return Response::api("Update Event Succsess",$event);
    }

    public function published($id, Request $req)
    {
        $event = Event::where("id",$id)->first();
        if(!$event){
            return Response::apiError("Not Found Event",$event,404);
        }

        if(!empty($req->is_publish)){
            if($req->is_publish != $event->is_publish)
                $event->publish_time = date('Y-m-d H:i:s');

            $event->is_publish = 1;
        }
        else{
            $event->publish_time = null;
            $event->is_publish = 0;
        }

        $update = $event->save();

        if($update)
            return Response::api("Update Event Succsess",$event);
    }

    public function joinEvent(Request $req)
    {
        $checkJoinEvent = JoinEvent::where("event_id",$req->event_id)
                                    ->where("status",1)
                                    ->where("user_id",$req->auth->id)
                                    ->first();
        $event = Event::where("id",$req->event_id)->first();
        if(!$event){
            return Response::apiError("Not Found Event",$event,404);
        }

        $payment = (object)[];
        $createEvent = array(
            "user_id" => $req->auth->id,
            "event_id" => $event->id,
        );
        if($event->price > 0 && !$checkJoinEvent){
            $createEvent["status"] = 0;
            $endTime = strtotime("+60 minutes");
            $expired = date('Y-m-d H:i:s', $endTime);
            $checkPayment = EventPayment::where("status", "PENDING")
                ->where("event_id", $event->id)
                ->where("user_id", $req->auth->id)
                ->where("expired", ">", $expired)->first();
            $linkInvoice = env("LINK_INVOICE")."/payment/method/";
            if ($checkPayment) {
                $payment = (object)[
                    "link" => $linkInvoice . $checkPayment->invoice_id,
                    "expired_date" => $checkPayment->expired,
                ];
            } else {
                $user = User::find($req->auth->id);
                $amount = "".$event->price."";
                $url = env("LINK_PAYMENT")."/merchant/requestInvoice/v2";
                $code = uniqid('EVENT-'.$req->auth->id."".$event->id, false);
                $createEvent["order_id"] = $code;
                $createEvent["price"] = $event->price;
                $body = ['json' => [
                    'merchantId' => env("MARCHANT_ID"),
                    'merchantKey' => env("MARCHANT_KEY"),
                    'orderId' => $code,
                    'amount' => $amount,
                    'orderInformations' => [[
                        "productName" => "event kormi",
                        "quantity" => "1",
                        "amount" => $amount,
                        "nama" => $event->title
                    ],],
                    "additionalInformation" => [
                        "emailNotif" => $user->email,
                        "subMerchantId"=> "Korminas-Sisti"
                    ],
                    "vaExpired" => 1200
                ]];
                $curl = Curl::Request("POST", $url, $body);
                $payment = (object)[];
                if ($curl["status_code"] == "200") {
                    $content = json_decode($curl["content"]);
                    $payment = (object)[
                        "link" => $linkInvoice . $content->invoiceId,
                        "expired_date" => $content->expiredDate,
                    ];
                    $createEvent["invoice_id"] = $content->invoiceId;
                    EventPayment::create([
                        'user_id' => $user->id,
                        'event_id' => $event->id,
                        'invoice_id' => $content->invoiceId,
                        'order_id' => $content->orderId,
                        'status' => "PENDING",
                        'expired' => $content->expiredDate,
                        'price' => $event->price,
                    ]);
                }
            }
        }else{
            if(!$checkJoinEvent){
                $createEvent["status"] = 1;
                $countJoin = JoinEvent::where("status",1)->where("event_id",$event->id)->count();
                $urut = $countJoin + 1;
                $createEvent["no_booking"] = JoinEvent::createNoBooking($event->id,$urut);
            }
        }

        $create = JoinEvent::updateOrCreate($createEvent);

        $create["event"] = $event;
        if($create){
            $create->payment = $payment;
            return Response::api("Update Event Succsess",$create);
        }
    }

    public function userEventList(Request $req)
    {
        $userId = $req->auth->id;
        $limit = $req->limit ? $req->limit : 20;
        $event = JoinEvent::select(["join_event.*", "events.event_end_date"])
            ->join("events","join_event.event_id","=","events.id")
//            ->leftJoin("event_payment", "join_event.event_id", '=', 'event_payment.event_id')
//            ->where("event_payment.status", 'PAID')
            ->where("join_event.user_id",$userId)
            ->whereNull("events.deleted_at")
            ->orderBy("events.event_date","DESC");

        $status = $req->get('status');
        if($status == "selesai")
        {
            $event = $event->where('events.event_end_date', "<", Carbon::now());
        }

        $event = $event->paginate($limit);
        if(!$event){
            return Response::apiError("Not Found Event",$event,404);
        }
        for ($i=0; $i < count($event); $i++) {
            $e = Event::where('id', $event[$i]->event_id)
                ->select("events.*", \DB::raw("(SELECT count(*) FROM event_comments
                          WHERE event_comments.user_id = $userId and event_comments.event_id = events.id
                        ) as has_comment"));
            $e = $e->get()->first();
            $e["end"] = false;
            if(time() > strtotime($e->event_date)){
                $e["end"] = true;
            }

            $event[$i]["event"] = $e;
        }
        return Response::api("List My Event",$event);
    }

    public function userEventPayment(Request $req)
    {
        $limit = $req->limit ? $req->limit : 20;
        $userId = $req->auth->id;
        $event = EventPayment::with(['event' => function($q) use ($userId) {
            $q->select("events.*", \DB::raw("(SELECT count(*) FROM event_comments
                          WHERE event_comments.user_id = $userId and event_comments.event_id = events.id
                        ) as has_comment"));
        }])->where("user_id", $userId);
        
        $status = $req->get('status');
        if($status)
            $event = $event->where('status', $status);

        $event = $event->paginate($limit);
        if(!$event){
            return Response::apiError("Not Found Event",$event,404);
        }

        return Response::api("List My Event",$event);
    }

    public function create(Request $req)
    {
        $validator = Validator::make($req->all(), $this->getRules());

        $validator->setAttributeNames($this->getAttributeValidation());

        if($validator->fails())
            return Response::apiError('Data tidak valid', $validator->errors());

        $imagePathName = Asset::setPath("cms","event",time().".png","admin");

        $image = Asset::uploadImage($imagePathName, $req->file('image'));

        $admin = Admin::find($req->auth->id);

        $organisasiInduk = $admin->organitation_parent_id;

        $event = array(
            "title" => $req->title,
            "description" => $req->description,
            "tags" => $req->tags,
            "image" => $image,
            "location" => $req->location,
            "price" => $req->price ? $req->price : 0,
            "webinar_url" => $req->webinar_url ? $req->webinar_url : "",
            "admin_id" => $req->auth->id,
            "show_for_location" => $req->auth->show_data_location && !empty($req->auth->show_data_location) ? $req->auth->show_data_location : "0",
            "end_registration" => $req->end_registration ?: null,
            "start_registration" => $req->start_registration ?: null,
            "event_date" => $req->event_date ? $req->event_date : null,
            "event_end_date" => $req->event_end_date ? $req->event_end_date : null,
            "category" => Event::category($req->category) ? $req->category : Event::category("default"),
            'video_url' => $req->video_url,
//            'time_start' => $req->time_start,
//            'time_end' => $req->time_end,
            "organitation_parent_id" => $organisasiInduk,
            "type_id" => $req->type_id,
        );

            $event["is_publish"] = $req->is_publish ? : 0;
            $event["publish_time"] = date('Y-m-d H:i:s');
        // if(!empty($req->is_publish)){
        //     $event["is_publish"] = 1;
        //     $event["publish_time"] = date('Y-m-d H:i:s');
        // }
        // else{
        //     $event["publish_time"] = null;
        //     $event["is_publish"] = 0;
        // }
        $create = Event::create($event);

        if($galleries = $req->file('galleries'))
        {
            foreach ($galleries as $gallery)
            {
                if(!$gallery)
                    continue;
                $imageGallery = $gallery ? $this->uploadFile($gallery, "cms/events") : null;
                EventFile::create([
                    'event_id' => $create->id,
                    'file' => $imageGallery,
                    'type' => strtok($gallery->getClientMimeType(), '/')
                ]);
            }
        }

        if($create){
            $create->load('eventFiles');
            Notification::send('event',[env("NOTIFICATION_PUBLIC_TAG")],$create->title,"event_detail",$create->id,false,true,"KORMI EVENT");
            return Response::api("Update Event Succsess",$create);
        }
    }

    public function delete(Request $req, $id)
    {
        $event = Event::find($id);
        $location = $req->auth->show_data_location && !empty($req->auth->show_data_location) ? $req->auth->show_data_location : "0";

        if(!$event || ($event && $location != $event->show_for_location)){
            return Response::apiError("Not Found Event",(object)[],404);
        }

        $delete = $event->delete();

        if($delete){
            return Response::api("Delete Event Succsess",$event);
        }
    }

    private function getAttributeValidation()
    {
        return [
            "start_registration" => "tanggal mulai registrasi",
            "end_registration" => "tanggal mulai registrasi",
            "video_url" => "link video"
        ];
    }

    private function getRules()
    {
        return [
            "title" => "required",
//            "description" => "required",
            "webinar_url" => "url",
            "video_url" => "url",
            "start_registration" => "required|date:Y-m-d H:i",
            "end_registration" => "required|date:Y-m-d H:i|after_or_equal:start_registration",
            "event_date" => "date_format:Y-m-d H:i:s",
            "event_end_date" => "date_format:Y-m-d H:i:s|after:event_date",
            "galleries" => "array|max:5",
            "galleries.*" => "mimes:jpeg,jpg,png",
        ];
    }

    public function export(Request $req) {
        $search = $req->search;
        $category = $req->category;
        $status = $req->status;
        $month = $req->month;
        $year = $req->year;
        $sort = Event::sortedValue($req->sort_key,$req->sort_condition);
        $event = Event::select("events.*","admins.name as author", "cities.name as location_name")
            ->leftJoin("cities","events.location","=","cities.id")->join("admins","events.admin_id","=","admins.id")
            ->where(function($query) use ($search,$category,$status,$month,$year){
                if(!empty($search))
                    $query->where("title","like","%".$search."%");
                if(!empty($month))
                    $query->whereMonth("events.created_at",$month);
                if(!empty($year))
                    $query->whereYear("events.created_at",$year);
                if(!empty($status)){
                    if($status == "publish")
                        $query->where("events.is_publish",1);
                    if($status == "unpublish")
                        $query->where("events.is_publish",0);
                }
                if(!empty($category) && $category != "all"){
                    $query->where("events.category",$category);
                }
            })->orderBy("events.".$sort->key,$sort->condition);

        if($req->auth->identity == 'admin')
        {
            $admin = Admin::find($req->auth->id);
            if($req->auth->id >= 1 && $req->auth->id <= 3)
                $event = $event->where('events.organitation_parent_id', $admin->organitation_parent_id);
        }
        $event = $event->with('organitationParent')->get();

        $header = [
            "TITLE" => 'title',
            "ORGANISASI INDUK" => "oraganisasi_induk",
            "TANGGAL REGISTRASI MULAI" => "start_registration",
            "TANGGAL REGISTRASI BERAKHIR" => "end_registration",
            "TANGGAL EVENT" => "event_date",
            "JAM MULAI EVENT" => "time_start",
            "JAM BERAKHIR EVENT" => "time_end",
            "LOCATION" => "location_name",
            "HARGA" => "price",
            "DIBUAT OLEH" => "author",
        ];


        $export = new ExportExcel($header, $event, "event_" . date("YmdHis"), $path = 'storage/export/event', $ext = 'xlsx');

        $result = $export->export();

        return Response::api('sukses', [
            "file" => $result['url'],
        ]);
    }

    public function deleteImage($id) {

        $event = Event::find($id);
        try{
            Asset::deleteImage($event->image);
            $event->image = null;
            $event->save();
        }
        catch (\Exception $e) {
            Response::apiError("Coba beberapa saat lagi", []);
        }

        $event->load('eventFiles');
        return Response::api("sukses mengahpus image", $event);
    }

    public function deletegallery($id)
    {
        $eventGallery = EventFile::find($id);
        if($eventGallery)
        {
            $this->deleteFile($eventGallery->file);
            $eventGallery->delete();

            return Response::api("File berhasil dihapus", []);
        }
        return Response::apiError("ID tidak valid", []);
    }

    public function eventPayment(Request $requets)
    {
        $perPage = $req->limit ?? env('TOTAL_PER_PAGE', 20);
        $keyword = $requets->get('search');
        $admin = Admin::find($requets->auth->id);

        $joinEvent = EventPayment::with(['user', 'event' => function($q){
            $q->select("events.*", "cities.name as location_name")
                ->leftJoin("cities","events.location","=","cities.id");
        }])
        ->whereHas('user')
        ->whereHas('event', function($q) use ($keyword, $admin) {
            if($admin->role >= 1 && $admin->role <= 3)
                $q->where('events.organitation_parent_id', $admin->organitation_parent_id);
        })
        ->where(function ($q) use ($keyword) {
            if($keyword)
            {
                $q->where('invoice_id', 'like', "%$keyword%")
                    ->orWhere('order_id', 'like', "%$keyword%");
            }
        })
        ->orderBy('created_at', 'desc');

        if($startDate = $requets->get("start_date"))
            $joinEvent = $joinEvent->where('created_at', '>=',$startDate);
        if($endDate = $requets->get("end_date"))
            $joinEvent = $joinEvent->where('created_at', '<=' , $endDate);

        $joinEvent = $joinEvent->paginate($perPage);

        $joinEvent->getCollection()->transform(function($value) {
            $value->total_price = $value->price ?? 0;
            $value->payment_link = env('LINK_INVOICE').'/payment/method/'.$value->invoice_id;
            return $value;
        });

        return Response::api("data fretch", $joinEvent);
    }

    public function eventPaymentDetail(Request $requets, $orderId)
    {
        $keyword = $requets->get('keyword');
        $admin = Admin::find($requets->auth->id);
        $joinEvent = EventPayment::with(['user', 'event' => function($q){
            $q->select("events.*", "cities.name as location_name")
                ->leftJoin("cities","events.location","=","cities.id");
        }])
        ->whereHas('user', function($q) use ($keyword) {
            if($keyword)
                $q->where('name', 'like', "%$keyword%");
        })
        ->whereHas('event', function($q) use ($keyword, $admin) {
            if($keyword)
                $q->where('title', 'like', "%$keyword%");

            if($admin->role >= 1 && $admin->role <= 3)
                $q->where('events.organitation_parent_id', $admin->organitation_parent_id);
        })
        ->orderBy('created_at', 'desc')
        ->where('order_id', $orderId)
        ->first();

        $joinEvent->admin_name = $admin->name;
        $joinEvent->admin_role = $admin->role_text;
        $joinEvent->city = $admin->city->name ?? '';
        $joinEvent->total_price = $joinEvent->event->price ?? 0;
        $joinEvent->total_price = env('LINK_INVOICE').'/payment/method/'.$joinEvent->invoice_id;

        return Response::api("data fetch", $joinEvent);
    }

    public function paymentExport(Request $requets)
    {
        $admin = Admin::find($requets->auth->id);

        $joinEvent = EventPayment::with(['user', 'event' => function($q){
            $q->select("events.*", "cities.name as location_name")
                ->leftJoin("cities","events.location","=","cities.id");
        }])
            ->whereHas('event', function($q) use ($admin) {
                if($admin->role >= 1 && $admin->role <= 3)
                    $q->where('events.organitation_parent_id', $admin->organitation_parent_id);
            })
            ->orderBy('created_at', 'desc');

        if($startDate = $requets->get("start_date"))
            $joinEvent = $joinEvent->where('created_at', '>=',$startDate);

        if($endDate = $requets->get("end_date"))
            $joinEvent = $joinEvent->where('created_at', '<=' , $endDate);

        $joinEvent = $joinEvent
            ->get()
            ->map(function($value) {
                return (object) [
                    'event_title' => $value->event->title ?? '',
                    'event_price' => $value->event->price ?? '',
                    'event_date' => $value->event->event_date ?? '',
                    'event_end_date' => $value->user->event_end_date ?? '',
                    'peserta' => $value->user->name ?? '',
                    'status' => $value->status,
                ];
            });
        $header = [
            "EVENT TITLE" => 'event_title',
            "PRICE" => 'event_price',
            "START DATE" => 'event_date',
            "END DATE" => 'event_end_date',
            "PESERTA" => 'peserta',
            "STATUS" => 'status',
        ];


        $export = new ExportExcel($header, $joinEvent, "join_event_" . date("YmdHis"), $path = 'storage/export/join_event', $ext = 'xlsx');

        $result = $export->export();

        return Response::api('sukses', [
            "file" => $result['url'],
        ]);
    }

    public function comments($id, Request $req) {
        $perPage = env('TOTAL_PER_PAGE', 20);
        if ($req->limit) {
            $perPage = $req->limit;
        }
        $search = $req->search;
        $status = $req->status;
        $month = $req->month;
        $year = $req->year;
        $sort = EventComment::sortedValue($req->sort_key, $req->sort_condition);

        $comments = EventComment::select('event_comments.*', 'users.name', 'users.email', 'users.avatar')
            ->join('users', 'event_comments.user_id', '=', 'users.id')->where('event_comments.event_id', $id)
            ->where(function ($query) use ($search, $status, $month, $year) {
                if (!empty($search))
                    $query->where("comment", "like", "%" . $search . "%");
                if (!empty($month))
                    $query->whereMonth("event_comments.created_at", $month);
                if (!empty($year))
                    $query->whereYear("event_comments.created_at", $year);
                if (!empty($status)) {
                    if ($status == "show")
                        $query->where("event_comments.status", 1);
                    if ($status == "hide")
                        $query->where("event_comments.status", 0);
                }
            })->orderBy("event_comments." . $sort->key, $sort->condition)
            ->get();

        $hideCount = EventComment::where('status', 0)->where('event_id', $id)->count();
        $showCount = EventComment::where('status', 1)->where('event_id', $id)->count();
        $count["hide"] = $hideCount;
        $count["show"] = $showCount;
        $res = array(
            "specific_count" => $count,
            "record" => $comments,
        );
        if (!$comments) {
            return Response::apiError("EventComment Not Found", [], 404);
        }
        return Response::api("EventComment Loaded Successfully", $res);
    }

    public function addRating($id, Request $req)
    {

        $user_id = $req->auth->id;
        $event = Event::where("id", $id)->first();
        if (!$event) {
            return Response::apiError("Event Not Found", $event, 404);
        }

        $check_user_join = JoinEvent::where("user_id", $user_id)->where("event_id", $id)->first();

        if (!$check_user_join) {
            return Response::apiError("User has not join the event", null, 403);
        }

        $check_comment = EventComment::where('user_id', $user_id)->where("event_id", $id)->first();

        if ($check_comment) {
            $comment = [
                'event_id' => intval($id),
                'user_id' => $user_id,
                'comment' => $req->comment ? $req->comment : $check_comment->comment,
                'rate' => $req->rate ? intval($req->rate) : $check_comment->rate,
                'status' => 1,
            ];
            $check_comment->update($comment);
            return Response::api('Comment Updated Successfully', $comment);
        }

        $comment = [
            'event_id' => intval($id),
            'user_id' => $user_id,
            'comment' => $req->comment ? $req->comment : null,
            'rate' => $req->rate ? intval($req->rate) : null,
            'status' => 1,
        ];

        $create = EventComment::create($comment);

        return Response::api('Comment Added Successfully', $create);
    }

    public function typeOffline()
    {
        $eventCategory = Event::typeOffline();

        return Response::api("Load Event Succsess",$eventCategory);
    }
}
