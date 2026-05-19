<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Alice Admin',   'email' => 'admin@hrm.test',   'role' => 'admin'],
            ['name' => 'Mark Manager',  'email' => 'manager@hrm.test', 'role' => 'manager'],
            ['name' => 'John Employee', 'email' => 'user@hrm.test',    'role' => 'user'],
            ['name' => 'Sara Staff',    'email' => 'sara@hrm.test',    'role' => 'employee'],
        ];
        
        foreach ($users as $data) {
            User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'     => $data['name'],
                    'role'     => $data['role'],
                    'password' => Hash::make('password'),
                ]
            );
        }
    }
}