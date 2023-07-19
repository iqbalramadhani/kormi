<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AdminToken extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_token', function (Blueprint $table) {
            $table->string('code',100);
            $table->integer('admin_id');
            $table->string('platform',100);
            $table->string('private_key',225);
            $table->timestamps();
            $table->primary('code');
            $table->index('admin_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admin_token');
    }
}
