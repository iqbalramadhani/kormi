<?php
namespace Illuminate\Database;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Facades\DB;
class SettingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('setting')->insert([
                    "register_price"=> 0,
                    "kormi_profile"=> "",
                    "message_invitation_register"=> "",
        ]);
    }
}
