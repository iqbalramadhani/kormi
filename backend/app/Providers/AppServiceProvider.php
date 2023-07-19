<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Builder;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('mailer', function ($app) {
            $app->configure('services');
            return $app->loadComponent('mail', 'Illuminate\Mail\MailServiceProvider', 'mailer');
            });
    }

    public function boot(){
        Builder::macro('whereLike', function($attribute, string $searchTerm = "none",$positionPers = "back") {
            $fPers="";
            $bPers="";
            switch($positionPers){
                case "back":
                    $bPers ="%";
                break;
                case "front":
                    $fPers = "%";
                break;
                case "all":
                    $bPers ="%";
                    $fPers ="%";
                break;
            }
            if(is_array ($attribute)){
                foreach($attribute as $key => $value){
                    if(!empty($value))
                    $query=$this->where($key, 'LIKE', $fPers.$value.$bPers);                    
                }
            }else{
                $query=$this->where($attribute, 'LIKE', $fPers.$searchTerm.$bPers);
            }

            return $query;
        });
    }
}
