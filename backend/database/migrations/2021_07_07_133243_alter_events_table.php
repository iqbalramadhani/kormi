<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->integer('organitation_parent_id')->unsigned()->index();
            $table->string('video_url')->nullable();
            $table->char('time_start', 5)->nullable();
            $table->char('time_end', 5)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('organitation_parent_id');
            $table->dropColumn('video_url');
            $table->dropColumn('time_start');
            $table->dropColumn('time_end');
        });
    }
}
