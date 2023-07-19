<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRegisterPayment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('register_payment', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_id',255);
            $table->string('email',255);
            $table->string('invoice_id',255);
            $table->string('order_id',255);
            $table->string('status',255);
            $table->dateTime('expired');
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
        Schema::dropIfExists('register_payment');
    }
}
