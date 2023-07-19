<?php

use Illuminate\Database\Seeder;
namespace Illuminate\Database;
use Illuminate\Support\Facades\DB;

class FacilityType extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $facility_type = array(array("name" => "Gym","id"=>2),
                         array("name" => "Futsal","id"=>1)
                     );
        DB::table('facility_type')->insert($facility_type);
    }
}
