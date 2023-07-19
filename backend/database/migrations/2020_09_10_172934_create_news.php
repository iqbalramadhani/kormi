<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNews extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('news', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title',255)->nullable();
            $table->string('category',255)->nullable();
            $table->string('tags',255)->nullable();
            $table->text('image')->nullable();
            $table->integer('show_for_location')->default(0);
            $table->text('location')->nullable();
            $table->text('description')->nullable();
            $table->integer('admin_id');
            $table->boolean('is_publish')->default(0);
            $table->timestamp('publish_time')->nullable();
            $table->index('admin_id');
            $table->index('category');
            $table->index('show_for_location');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mews');
    }
}
