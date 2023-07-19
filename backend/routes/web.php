<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->group(['middleware' => ['app.cors']], function () use ($router) {
    $router->get('/', function () use ($router) {
        return $router->app->version();
    });

    //------------------------------ NO MIDDLEWARE ---------------------------------------------
    // User Login
    Route::post('/auth/login', 'AuthController@login');
    $router->post('/auth/forget-password', 'AuthController@forgetPassword');
    $router->put('/auth/reset-password', 'AuthController@resetPassword');
    $router->post('/auth/register', 'UserController@create');
    $router->post('/auth/otp', 'UserController@sendOtp');
    $router->get('/auth/register', 'UserController@detailRegister');
    $router->get('/testNotif', 'NewsController@testNotif');
    $router->post('/register-payment-notif', 'SettingController@paymentNotif');
    $router->post('/payment-notif', 'SettingController@paymentNotif');

    // Admin
    Route::post('/auth/admin-login', 'AdminAuthController@login');
    $router->put('/auth/admin-forget-password', 'AdminAuthController@forgetPassword');
    $router->put('/auth/admin-reset-password', 'AdminAuthController@resetPassword');

    //------------------------------------------------------------------------------------------

    // App News
    $router->group(['prefix' => 'news'], function () use ($router) {
        $router->get('/detail/{id}', 'NewsController@detail');
        $router->get('/category', 'NewsController@category');
    });

    // App Promotion
    $router->group(['prefix' => 'promotion'], function () use ($router) {
        $router->get('/detail/{id}', 'PromotionController@detail');
        $router->get('/category', 'PromotionController@category');
        $router->get('/', 'PromotionController@index');
    });
});
     // App Master Organisasi
   $router->group(['prefix' => 'master-status-organization'], function () use ($router) {
       $router->get('/detail/{id}', 'MasterStatusControllerOrganisasi@detail');
   });

// App Master Komisi
$router->group(['prefix' => 'commission-master'], function () use ($router) {
    $router->get('/detail/{id}', 'MasterKomisiController@detail');
});

// Administrator
    $router->group(['prefix' => 'administrator'], function () use ($router) {
        $router->get('/detail/{id}', 'AdministratorController@detail');
    });
    // App Event
    $router->group(['prefix' => 'event'], function () use ($router) {
        $router->get('/category', 'EventController@category');
        $router->get('/type/offline', 'EventController@typeOffline');
    });

    // City
    $router->group(['prefix' => 'city'], function () use ($router) {
        $router->get('/list', 'CityController@index');
    });
    // Province
    $router->group(['prefix' => 'province'], function () use ($router) {
        $router->get('/list', 'ProvinceController@index');
    });

    // District
    $router->group(['prefix' => 'district'], function () use ($router) {
        $router->get('/list', 'DistrictController@index');
    });

    // Village
    $router->group(['prefix' => 'village'], function () use ($router) {
        $router->get('/list', 'VillageController@index');
    });

    $router->group(['prefix' => 'setting'], function () use ($router) {
        $router->get('/', 'SettingController@index');
        $router->get('/pengurus', 'SettingController@getPengurus');
    });

    $router->group(['middleware' => ['jwt.auth.user']], function () use ($router) {
        $router->get('/dashboard', ['uses' => 'SettingController@getDashboard', 'role' => ['admin']]);
        // App News
        $router->group(['prefix' => 'setting'], function () use ($router) {
            $router->post('/', ['uses' => 'SettingController@update', 'role' => ['admin']]);
        });

        $router->group(['prefix' => 'setting'], function () use ($router) {
            $router->get('/induk/index', ['uses' => 'SettingIndukController@index', 'role' => ['admin', 'user']]);
            $router->post('/induk/index', ['uses' => 'SettingIndukController@index', 'role' => ['admin']]);
            $router->post('/induk', ['uses' => 'SettingIndukController@update', 'role' => ['admin']]);
            $router->delete('/induk/delete/{field}', ['uses' => 'SettingIndukController@delete', 'role' => ['admin']]);
        });


        $router->group(['namespace' => '\App\Http\Controllers'], function () use ($router) {
            $router->post('/auth/logout', ['uses' => 'AuthController@logout', 'role' => ['user']]);
            $router->post('/auth/admin-logout', ['uses' => 'AdminAuthController@logout', 'role' => ['admin']]);

            // App News
            $router->group(['prefix' => 'news'], function () use ($router) {
                $router->get('/detail/{id}', ['uses' =>'NewsController@detail', 'role' => ['admin', 'user']]);
                $router->post('/create', ['uses' => 'NewsController@create', 'role' => ['admin']]);
                $router->post('/update/{id}', ['uses' => 'NewsController@update', 'role' => ['admin']]);
                $router->post('/published/{id}', ['uses' => 'NewsController@published', 'role' => ['admin']]);
                $router->delete('/delete/{id}', ['uses' => 'NewsController@delete', 'role' => ['admin']]);
                $router->get('/', ['uses' => 'NewsController@index', 'authOptional' => true, 'role' => ['admin', 'user']]);
                $router->get('/export', ['uses' => 'NewsController@export', 'role' => ['admin']]);
                $router->delete('/delete/{id}/image', ['uses' => 'NewsController@deleteImage', 'role' => ['admin']]);
                $router->delete('/delete/{id}/gallery', ['uses' => 'NewsController@deleteGallery', 'role' => ['admin']]);

                // add comment
                $router->post('/comment/{newsId}', ['uses' => 'NewsCommentController@store', 'role' => ['user']]);
                $router->get('/comment/{newsId}', ['uses' => 'NewsCommentController@indexComment', 'role' => ['user','admin']]);
                $router->post('/like/{newsId}', ['uses' => 'NewsCommentController@likeStoreOrDelete', 'role' => ['user','admin']]);
                $router->get('/like/{newsId}', ['uses' => 'NewsCommentController@indexLike', 'role' => ['user']]);
            });

            // App Promotion
            $router->group(['prefix' => 'promotion'], function () use ($router) {
                $router->post('/create', ['uses' => 'PromotionController@create', 'role' => ['admin']]);
                $router->post('/update/{id}', ['uses' => 'PromotionController@update', 'role' => ['admin']]);
                $router->put('/published/{id}', ['uses' => 'PromotionController@published', 'role' => ['admin']]);
                $router->delete('/delete/{id}', ['uses' => 'PromotionController@delete', 'role' => ['admin']]);
            });

            // App Event
            $router->group(['prefix' => 'event'], function () use ($router) {
                $router->get('/', ['uses' => 'EventController@index', 'authOptional' => true, 'role' => ['admin', 'user']]);
                $router->get('/detail/{id}', ['uses' => 'EventController@detail', 'authOptional' => true, 'role' => ['admin', 'user']]);
                $router->post('/create', ['uses' => 'EventController@create', 'role' => ['admin']]);
                $router->get('/member/{id}', ['uses' => 'EventController@listMemberEvent', 'role' => ['admin']]);
                $router->post('/update/{id}', ['uses' => 'EventController@update', 'role' => ['admin']]);
                $router->post('/published/{id}', ['uses' => 'EventController@published', 'role' => ['admin']]);
                $router->delete('/delete/{id}', ['uses' => 'EventController@delete', 'role' => ['admin']]);
                $router->get('/export', ['uses' => 'EventController@export', 'role' => ['admin']]);
                $router->delete('/delete/{id}/image', ['uses' => 'EventController@deleteImage', 'role' => ['admin']]);
                $router->delete('/delete/{id}/gallery', ['uses' => 'EventController@deleteGallery', 'role' => ['admin']]);

                $router->get('/comment/{id}', ['uses'=>'EventController@comments','role'=>['user','admin']]);
                $router->post('/rating/{id}', ['uses'=>'EventController@addRating','role'=>['user','admin']]);
            });

            $router->group(['prefix' => 'event-payment'], function () use ($router) {
                $router->get('/list', ['uses' => 'EventController@eventPayment', 'role' => ['admin']]);
                $router->get('/detail/{invoice_id}', ['uses' => 'EventController@eventPaymentDetail', 'role' => ['admin']]);
                $router->get('/export', ['uses' => 'EventController@paymentExport', 'role' => ['admin']]);
            });

            //pengurus
            $router->group(['prefix' => 'pengurus'], function () use ($router) {
                $router->get('/', ['uses' => 'PengurusController@index', 'authOptional' => true, 'role' => ['admin']]);
                $router->get('/detail/{id}', ['uses' => 'PengurusController@show', 'role' => ['admin']]);
                $router->post('/create', ['uses' => 'PengurusController@store', 'role' => ['admin']]);
                $router->put('/update/{id}', ['uses' => 'PengurusController@update', 'role' => ['admin']]);
                $router->delete('/delete/{id}', ['uses' => 'PengurusController@delete', 'role' => ['admin']]);
                $router->get('/export', ['uses' => 'PengurusController@export', 'role' => ['admin']]);
            });

            //pengurus kormi
            $router->group(['prefix' => 'pengurus-kormi'], function () use ($router) {
                $router->get('/', ['uses' => 'PengurusKormiController@index', 'authOptional' => true, 'role' => ['admin']]);
                $router->get('/detail/{id}', ['uses' => 'PengurusKormiController@show', 'role' => ['admin']]);
                $router->post('/create', ['uses' => 'PengurusKormiController@store', 'role' => ['admin']]);
                $router->put('/update/{id}', ['uses' => 'PengurusKormiController@update', 'role' => ['admin']]);
                $router->delete('/delete/{id}', ['uses' => 'PengurusKormiController@delete', 'role' => ['admin']]);
                $router->get('/export', ['uses' => 'PengurusKormiController@export', 'role' => ['admin']]);
            });
            // App Master
            $router->group(['prefix' => 'master'], function () use ($router) {
                // Master Organitation Status
                $router->group(['prefix' => 'organitation-status'], function () use ($router) {
                    $router->get('/', ['uses' => 'MasterOrganitationStatusController@index', 'authOptional' => true, 'role' => ['admin', 'user']]);
                    $router->get('/detail/{id}', ['uses' => 'MasterOrganitationStatusController@detail', 'authOptional' => true, 'role' => ['admin', 'user']]);
                    $router->post('/create', ['uses' => 'MasterOrganitationStatusController@create', 'role' => ['admin']]);
                    $router->put('/update/{id}', ['uses' => 'MasterOrganitationStatusController@update', 'role' => ['admin']]);
                    $router->delete('/delete/{id}', ['uses' => 'MasterOrganitationStatusController@delete', 'role' => ['admin']]);
                });

                // Master Organitation Parent
                $router->group(['prefix' => 'organitation-parent'], function () use ($router) {
                    $router->get('/', ['uses' => 'MasterOrganitationParentController@index', 'authOptional' => true, 'role' => ['admin', 'user']]);
                    $router->get('/detail/{id}', ['uses' => 'MasterOrganitationParentController@detail', 'authOptional' => true, 'role' => ['admin', 'user']]);
                    $router->post('/create', ['uses' => 'MasterOrganitationParentController@create', 'role' => ['admin']]);
                    $router->post('/file/{id}', ['uses' => 'MasterOrganitationParentController@updateFile', 'role' => ['admin']]);
                    $router->post('/update/{id}', ['uses' => 'MasterOrganitationParentController@update', 'role' => ['admin']]);
                    $router->delete('/delete/{id}', ['uses' => 'MasterOrganitationParentController@delete', 'role' => ['admin']]);
                    $router->get('/export',['uses' => 'MasterOrganitationParentController@export','role' => ['admin']]);
                });

                // Master Commission
                $router->group(['prefix' => 'commission'], function () use ($router) {
                    $router->get('/', ['uses' => 'MasterCommissionController@index', 'authOptional' => true, 'role' => ['admin', 'user']]);
                    $router->get('/detail/{id}', ['uses' => 'MasterCommissionController@detail', 'authOptional' => true, 'role' => ['admin', 'user']]);
                    $router->post('/create', ['uses' => 'MasterCommissionController@create', 'role' => ['admin']]);
                    $router->put('/update/{id}', ['uses' => 'MasterCommissionController@update', 'role' => ['admin']]);
                    $router->delete('/delete/{id}', ['uses' => 'MasterCommissionController@delete', 'role' => ['admin']]);
                    $router->delete('/uploadexcel', ['uses' => 'MasterCommissionController@uploadexcel', 'role' => ['admin']]);
                });

                // Master Category
                $router->group(['prefix' => 'category'], function () use ($router) {
                    $router->get('/', ['uses' => 'CategoryController@index', 'authOptional' => true, 'role' => ['admin', 'user']]);
                    $router->get('/detail/{id}', ['uses' => 'CategoryController@show', 'authOptional' => true, 'role' => ['admin', 'user']]);
                    $router->post('/create', ['uses' => 'CategoryController@createOrUpdate', 'role' => ['admin']]);
                    $router->put('/update/{id}', ['uses' => 'CategoryController@createOrUpdate', 'role' => ['admin']]);
                    $router->delete('/delete/{id}', ['uses' => 'CategoryController@delete', 'role' => ['admin']]);
                });

                $router->group(['prefix' => 'jabatan'], function () use ($router) {
                    $router->get('/', ['uses' => 'JabatanController@index', 'authOptional' => true, 'role' => ['admin']]);
                    $router->get('/detail/{id}', ['uses' => 'JabatanController@show', 'role' => ['admin']]);
                    $router->post('/create', ['uses' => 'JabatanController@store', 'role' => ['admin']]);
                    $router->put('/update/{id}', ['uses' => 'JabatanController@update', 'role' => ['admin']]);
                    $router->delete('/delete/{id}', ['uses' => 'JabatanController@delete', 'role' => ['admin']]);
                });
            });
            // App administrator
            $router->group(['prefix' => 'administrator'], function () use ($router) {
                $router->get('/list', ['uses' => 'AdministratorController@index', 'authOptional' => true, 'role' => ['admin', 'user']]);
                $router->post('/create', ['uses' => 'AdministratorController@create', 'role' => ['admin']]);
                $router->post('/uploadexcel', ['uses' => 'AdministratorController@uploadexcel', 'role' => ['admin']]);
                $router->get('/export', ['uses' => 'AdministratorController@export', 'role' => ['admin']]);

                $router->put('/update/{id}', ['uses' => 'AdministratorController@update', 'role' => ['admin']]);
                $router->delete('/delete/{id}', ['uses' => 'AdministratorController@delete', 'role' => ['admin']]);
                $router->get('/type', ['uses' => 'AdministratorController@geType', 'role' => ['admin']]);
            });
            // App Master Organisasi
            $router->group(['prefix' => 'master-status-organization'], function () use ($router) {
                $router->post('/create', ['uses' => 'MasterStatusOrganisasiController@create', 'role' => ['admin']]);
                $router->put('/update/{id}', ['uses' => 'MasterStatusOrganisasiController@update', 'role' => ['admin']]);
                $router->delete('/delete/{id}', ['uses' => 'MasterStatusOrganisasiController@delete', 'role' => ['admin']]);
            });
            // App Master Komisi
                $router->group(['prefix' => 'commission-master'], function () use ($router) {
                $router->post('/create', ['uses' => 'MasterKomisiController@create', 'role' => ['admin']]);
                $router->put('/update/{id}', ['uses' => 'MasterKomisiController@update', 'role' => ['admin']]);
                $router->delete('/delete/{id}',     ['uses' => 'MasterKomisiController@delete', 'role' => ['admin']]);
            });

            // User
            $router->group(['prefix' => 'user'], function () use ($router) {
                $router->post('/generate-user-number', ['uses' => 'UserController@generateUserNumber', 'role' => ['admin']]);
                $router->post('/join-event', ['uses' => 'EventController@joinEvent', 'role' => ['user']]);
                $router->get('/my-event', ['uses' => 'EventController@userEventList', 'role' => ['user']]);
                $router->get('/my-event-payment', ['uses' => 'EventController@userEventPayment', 'role' => ['user']]);
                $router->get('/profession', ['uses' => 'UserController@profession', 'role' => ['user']]);
                $router->get('/profile', ['uses' => 'UserController@profile', 'role' => ['user']]);
                $router->post('/join-admin', ['uses' => 'UserController@joinAdmin', 'role' => ['user']]);
                $router->get('/join-admin', ['uses' => 'UserController@profileJoinAdmin', 'role' => ['user']]);
                $router->post('/profile', ['uses' => 'UserController@profileUpdate', 'role' => ['user']]);
                $router->post('/avatar', ['uses' => 'UserController@avatarUpdate', 'role' => ['user']]);
                $router->put('/change-password', ['uses' => 'UserController@changePassword', 'role' => ['user']]);
                $router->put('/change-role/{id}', ['uses' => 'UserController@roleUpdate', 'role' => ['admin']]);
                $router->put('/change-status/{id}', ['uses' => 'UserController@updateStatus', 'role' => ['admin']]);
                $router->delete('/delete/{id}', ['uses' => 'UserController@delete', 'role' => ['admin']]);
                $router->post('/create-by-admin', ['uses' => 'UserController@createFromAdmin', 'role' => ['admin']]);
                $router->post('/create', ['uses' => 'UserController@store', 'role' => ['admin']]);

                $router->post('/import', ['uses' => 'UserController@import', 'role' => ['admin']]);
                $router->post('/export', ['uses' => 'UserController@export', 'role' => ['admin']]);
                $router->get('/download/template', ['uses' => 'UserController@templateExcel', 'role' => ['admin']]);
                $router->get('/export/data', ['uses' => 'UserController@exportAll', 'role' => ['admin']]);

                $router->get('/list-member', ['uses' => 'UserController@listMember', 'role' => ['admin']]); // List Member
                $router->get('/detail-member/{id}', ['uses' => 'UserController@detailMember', 'role' => ['admin']]); // Detail Member

                $router->get('/list-join-admin', ['uses' => 'UserController@listJoinAdmin', 'role' => ['admin']]); // List Admin
                $router->put('/updatemember/{id}', ['uses' => 'UserController@updatemember', 'role' => ['admin']]); // List Admin
                $router->post('/create-invoice', ['uses' => 'UserController@createInvoice', 'role' => ['admin']]); // List Admin
                $router->post('/bulk-payment', ['uses' => 'UserController@bulkPayment', 'role' => ['admin']]);
                $router->get('/events', ['uses' => 'UserController@events', 'role' => ['user']]);
                $router->get('/events/{type}', ['uses' => 'UserController@events', 'role' => ['user']]);
                $router->get('/pengurus', ['uses' => 'AdministratorController@userPengurus', 'role' => ['user']]);
            });

            //Register Payment
            $router->group(['prefix' => 'register-payment'], function () use ($router) {
                $router->get('/detail/{id}', ['uses' => 'RegisterPaymentController@detail', 'role' => ['admin']]);
                $router->get('/list', ['uses' => 'RegisterPaymentController@index', 'role' => ['admin']]);
                $router->get('/export', ['uses' => 'RegisterPaymentController@export', 'role' => ['admin']]);
            });

                // Admin
                $router->group(['prefix' => 'admin'], function () use ($router) {
                    $router->get('/profile', ['uses' => 'AdminController@profile', 'role' => ['admin']]);
                    $router->post('/profile', ['uses' => 'AdminController@profileUpdate', 'role' => ['admin']]);
                    $router->post('/avatar', ['uses' => 'AdminController@avatarUpdate', 'role' => ['admin']]);
                    $router->post('/create', ['uses' => 'AdminController@create', 'role' => ['admin']]);
                    $router->put('/change-password', ['uses' => 'AdminController@changePassword', 'role' => ['admin']]);

                    $router->put('/change-role/{id}', ['uses' => 'AdminController@roleUpdate', 'role' => ['admin']]);
                    $router->put('/change-status/{id}', ['uses' => 'AdminController@updateStatus', 'role' => ['admin']]);
                    $router->delete('/delete/{id}', ['uses' => 'AdminController@delete', 'role' => ['admin']]);

                    $router->get('/list', ['uses' => 'AdminController@list', 'role' => ['admin']]); // List Member
                    $router->get('/role-list', ['uses' => 'AdminController@roleList', 'role' => ['admin']]); // List Member
                    $router->get('/detail/{id}', ['uses' => 'AdminController@detailAdmin', 'role' => ['admin']]); // Detail Member

                    $router->get('/list-join-admin', ['uses' => 'AdminController@listJoinAdmin', 'role' => ['admin']]); // List Admin
                    $router->post('/update/{id}', ['uses' => 'AdminController@update', 'role' => ['admin']]);
                    $router->get('/export',['uses' => 'AdminController@export', 'role' => ['admin']]);
                });
            });
    });
