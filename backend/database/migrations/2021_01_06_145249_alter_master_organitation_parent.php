<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterMasterOrganitationParent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('master_organitation_parent', function (Blueprint $table) {
            $table->string('parent_code')->nullable();
            $table->text('parent_sk')->nullable();
            $table->string('bank_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('master_organitation_parent', function (Blueprint $table) {
            if (Schema::hasColumn('master_organitation_parent', 'parent_code')) {
                $table->dropColumn('parent_code');
            }
            if (Schema::hasColumn('master_organitation_parent', 'parent_code')) {
                $table->dropColumn('parent_code');
            }
            if (Schema::hasColumn('master_organitation_parent', 'bank_name')) {
                $table->dropColumn('bank_name');
            }
        });
    }
}
