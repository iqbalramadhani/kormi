<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserNumber extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_numbers', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->integer('sequence')->unsigned();
            $table->string('prefix',15);
            $table->integer('user_id');
            $table->integer('status')->default(1);
            $table->timestamps();
            $table->primary(array('prefix', 'sequence'));
    
        });
        DB::statement('ALTER TABLE user_numbers MODIFY sequence INTEGER NOT NULL AUTO_INCREMENT');
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
