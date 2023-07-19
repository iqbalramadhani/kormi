<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPriceToJoinEventTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('join_event', function (Blueprint $table) {
            $table->bigInteger('price')->nullable();
        });

        Schema::table('event_payment', function (Blueprint $table) {
            $table->bigInteger('price')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('join_event', function (Blueprint $table) {
            $table->dropColumn('price');
        });
        Schema::table('event_payment', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
}
