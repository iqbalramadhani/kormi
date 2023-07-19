<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\UsersTableSeeder;
use Illuminate\Database\ProvincesSeeder;
use Illuminate\Database\CitiesSeeder;
use Illuminate\Database\DistrictsSeeder;
use Illuminate\Database\VillagesSeeder;
use Illuminate\Database\SettingTableSeeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->clear_data();
        // $this->call(SettingTableSeeder::class);
        $this->call(ProvincesSeeder::class);
        $this->call(CitiesSeeder::class);
        // $this->call(DistrictsSeeder::class);
        // $this->call(VillagesSeeder::class);
        // $this->call(UsersTableSeeder::class);
    }

    function clear_data(){
        // \DB::table('villages')->delete();
        // \DB::table('districts')->delete();
        // \DB::table('role')->delete();
        // \DB::table('cities')->delete();
        // \DB::table('provinces')->delete();
    }
}
