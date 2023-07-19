<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIndukOrganisasi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('master_organitation_parent', function (Blueprint $table) {
            $table->increments('id');
            $table->string('parent_no',255)->nullable();
            $table->string('parent_name',255)->nullable();
            $table->text('ad_rt')->nullable();
            $table->text('notarial_deed')->nullable();
            $table->text('sk_kumham')->nullable();
            $table->text('board_of_management')->nullable();
            $table->text('npwp')->nullable();
            $table->string('bank_account_no',255)->nullable();
            $table->string('main_province',255)->nullable();
           
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
        Schema::dropIfExists('induk_organisasi');
    }
}
