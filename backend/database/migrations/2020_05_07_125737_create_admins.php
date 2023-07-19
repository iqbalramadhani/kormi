<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdmins extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',225);
            $table->string('email',225);
            $table->integer('role');
            $table->integer('status')->default(0);
            $table->string('password',225);
            $table->text('avatar')->nullable();
            $table->string('phone_number',225)->nullable();
            $table->char('provinces_id',2)->nullable();
            $table->foreign('provinces_id')->references('id')->on('provinces');
            $table->char('cities_id',4)->nullable();
            $table->foreign('cities_id')->references('id')->on('cities');
            $table->char('districts_id',7)->nullable();
            $table->foreign('districts_id')->references('id')->on('districts');
            $table->char('villages_id',10)->nullable();
            $table->foreign('villages_id')->references('id')->on('villages');
            $table->text('address')->nullable();
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
