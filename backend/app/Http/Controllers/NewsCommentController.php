<?php


namespace App\Http\Controllers;


use App\Library\Response;
use App\NewsComment;
use App\NewsLike;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Lumen\Routing\Controller;

class NewsCommentController extends Controller
{
    public function indexComment(Request $req, $id)
    {
        $perPage = $req->limit ?? env('TOTAL_PER_PAGE', 20);

        $comments = NewsComment::where('news_id', $id)->with(['user' => function($q){
            $q->select('id','name', 'avatar');
        }])->orderBy('created_at', 'desc')->paginate($perPage);

        return Response::api('data berhasil di listing', $comments);
    }

    public function indexLike(Request $req, $id)
    {
        $perPage = $req->limit ?? env('TOTAL_PER_PAGE', 20);

        $likes = NewsLike::where('news_id', $id)->with(['user' => function($q){
            $q->select('id','name', 'avatar');
        }])->orderBy('created_at', 'desc')->paginate($perPage);

        return Response::api('data berhasil di listing', $likes);
    }

    public function store(Request $request, $newsId) {

        $validator = Validator::make($request->all(), [
            "description" => "required",
        ]);
        $validator->setAttributeNames(['description' => 'Komentar']);

        if($validator->fails())
            return Response::apiError('Data tidak valid', $validator->errors());

        $user = User::find($request->auth->id);
        if($user) {
            $newsComment = new NewsComment();
            $newsComment->user_id = $user->id;
            $newsComment->description = $request->get('description');
            $newsComment->news_id = $newsId;
            $newsComment->save();

            return Response::api("comment telah tersimpan", $newsComment);
        }

        return Response::apiError("User tidak ditemukan");
    }

    public function likeStoreOrDelete(Request $request, $newsId) {
        $user = User::find($request->auth->id);
        if($user) {
            $newsLike = NewsLike::where('user_id', $user->id)->where('news_id', $newsId)->first();
            if($newsLike)
            {
                $newsLike->delete();
                return Response::api("Like berhasil dihapus", []);
            }


            $newsLike = new NewsLike();
            $newsLike->user_id = $user->id;
            $newsLike->news_id = $newsId;
            $newsLike->save();

            return Response::api("comment telah tersimpan", $newsLike);
        }

        return Response::apiError("User tidak ditemukan");
    }
}