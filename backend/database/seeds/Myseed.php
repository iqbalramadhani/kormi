<?php
namespace Illuminate\Database;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class Myseed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role = array(array("name" => "Super Admin","id"=>1),
                      array("name" => "Owner","id"=>2),
                      array("name" => "Employe","id"=>3),
                      array("name" => "Referral","id"=>4)
                     );
        DB::table('role')->insert($role);

        $user = array(
                array(
                'role_id'=>1,
                'business_id'=>Null,
                'place_id'=>Null,
                'name'=>"surya",
                'email'=>"surya@admin.com",
                'phone_number'=>"082284559567",
                'password'=>Hash::make("123456"),
                'image'=>NULL,
                )
        );
        DB::table('users')->insert($user);
    }
}
