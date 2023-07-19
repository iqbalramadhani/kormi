<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdminsPortal extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // INSERT INTO `users` (`id`, `name`, `email`, `role`, `status`, `gender`, `birth_date`, `password`, `avatar`, `phone_number`, `place_of_birth`, `provinces_id`, `cities_id`, `districts_id`, `villages_id`, `address`, `post_code`, `current_agency`, `profession`, `organizational_experience`, `created_at`, `updated_at`) VALUES (NULL, 'dev mobile', 'mobile@mobile.com', '0', '1', 'l', '1990-04-09', '$2y$10$s1Yj8WVig/wq9dD.TKJNMua2cP2WYG9Z7tYcdAsgWCLEEu.S0T33.', NULL, '', NULL, NULL, NULL, NULL, NULL, ' required,', NULL, NULL, NULL, NULL, NULL, NULL);
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',225);
            $table->string('email',225);
            $table->integer('role');
            $table->integer('status')->default(0);
            $table->enum('gender', array('l', 'p'))->default('l');
            $table->date('birth_date')->nullable();
            $table->string('password',225);
            $table->text('avatar')->nullable();
            $table->string('phone_number',225)->nullable();
            $table->char('place_of_birth',4)->nullable();
            $table->foreign('place_of_birth')->references('id')->on('cities');
            $table->char('provinces_id',2)->nullable();
            $table->foreign('provinces_id')->references('id')->on('provinces');
            $table->char('cities_id',4)->nullable();
            $table->foreign('cities_id')->references('id')->on('cities');
            $table->char('districts_id',7)->nullable();
            $table->foreign('districts_id')->references('id')->on('districts');
            $table->char('villages_id',10)->nullable();
            $table->foreign('villages_id')->references('id')->on('villages');
            $table->text('address')->nullable();
            $table->string('post_code',225)->nullable();
            $table->string('current_agency',225)->nullable();
            $table->string('profession',225)->nullable();
            $table->text('organizational_experience')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
