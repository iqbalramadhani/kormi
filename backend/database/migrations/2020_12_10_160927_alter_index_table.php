<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterIndexTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('join_event', function (Blueprint $table) {
            $table->index(["status"]);
        });

        Schema::table('event_payment', function (Blueprint $table) {
            $table->index(["user_id","event_id"]);
            $table->index(["order_id"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
