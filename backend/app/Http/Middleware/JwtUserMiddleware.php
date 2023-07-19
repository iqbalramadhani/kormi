<?php
namespace App\Http\Middleware;
use Illuminate\Http\Request;
use Closure;
use Exception;
use App\User;
use App\Library\Response;
use App\UserToken;
use App\AdminToken;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
class JwtUserMiddleware
{
    private function __cekMyKey($id,$private_key,$platform,$identity){
        if($identity == "user")
            $my_key = UserToken::where(["user_id"=>$id,"platform"=>$platform,"private_key"=>$private_key])->first();
        
        if($identity == "admin")
            $my_key = AdminToken::where(["admin_id"=>$id,"platform"=>$platform,"private_key"=>$private_key])->first();

        if($my_key){
            return true;
        }
        return false;
    }

    public function handle($request, Closure $next, $guard = null)
    {
        $token = $request->header('Authorization');
        $actions = $request->route();
          
        if(!$token) {
            if(isset($actions[1]['authOptional']) && $actions[1]['authOptional']){
                return $next($request);
            }
            // Unauthorized response if token not there
            return Response::apiError("Token not set.",[],401);
        }
        try {
            $cek = explode(" ",$token);
            if($cek[0] == "Bearer"){
                $credentials = JWT::decode($cek[1], env('JWT_SECRET'), ['HS256']);
                if(!in_array($credentials->data->identity, $actions[1]['role'])){
                    return Response::apiError("Not have Access.",[],403);
                }

                if($credentials->data->refresh == true){
                    $my_key = false;    
                }else{
                    $my_key = $this->__cekMyKey($credentials->data->id,$credentials->data->private_key,$credentials->data->platform,$credentials->data->identity);  
                }if($my_key == true){
                    $request->auth = $credentials->data;
                    return $next($request);
                }
            }
            return Response::apiError("Please Check You'r Token.",[],401);
        } catch(ExpiredException $e) {
            return Response::apiError("Provided token is expired.",[],401);
        } catch(Exception $e) {
            return Response::apiError("An error while decoding token.",$e->getMessage(),401);
        }
        // $user = User::find($credentials->data->id);
        // Now let's put the user in the request class so that you can grab it from there
    }
}