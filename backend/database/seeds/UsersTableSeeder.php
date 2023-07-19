<?php

namespace Illuminate\Database;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('admins')->insert([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'role' => '0',
            'status' => '1',
            'address' => '',
            'phone_number' => '',
            'password' => Hash::make('12345678'),
        ]);

        DB::table('admins')->insert([
            'name' => 'admin',
            'email' => 'admin_nasional@admin.com',
            'role' => '1',
            'status' => '1',
            'address' => '',
            'phone_number' => '',
            'password' => Hash::make('12345678'),
        ]);

        DB::table('admins')->insert([
            'name' => 'admin',
            'email' => 'admin_provinsi@admin.com',
            'role' => '2',
            'status' => '1',
            'address' => '',
            'provinces_id' => 11,
            'phone_number' => '',
            'password' => Hash::make('12345678'),
        ]);

        DB::table('admins')->insert([
            'name' => 'admin',
            'email' => 'admin_kota@admin.com',
            'role' => '3',
            'status' => '1',
            'address' => '',
            'provinces_id' => 11,
            'cities_id' => 1101,
            'phone_number' => '',
            'password' => Hash::make('12345678'),
        ]);

        DB::table('admins')->insert([
            'name' => 'admin',
            'email' => 'admin_komisi@admin.com',
            'role' => '4',
            'status' => '1',
            'address' => '',
            'commission_id' => 1,
            'phone_number' => '',
            'password' => Hash::make('12345678'),
        ]);

        DB::table('admins')->insert([
            'name' => 'admin',
            'email' => 'admin_komisi_daerah@admin.com',
            'role' => '5',
            'status' => '1',
            'address' => '',
            'commission_id' => 1,
            'provinces_id' => 11,
            'phone_number' => '',
            'password' => Hash::make('12345678'),
        ]);
    }
}
