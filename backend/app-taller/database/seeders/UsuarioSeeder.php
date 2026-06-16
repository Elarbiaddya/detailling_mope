<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([

            [
                'nombre' => 'Administrador',
                'usuario' => 'Admin',
                'email' => 'admin@taller.com',
                'password' => Hash::make('Admin'),
                'telefono' => '123456789',
                'direccion' => 'Calle Ficticia 123',
                'rol_id' => 1
            ],

            [
                'nombre' => 'Juan Palas',
                'usuario' => 'juanpalas',
                'email' => 'cliente@taller.com',
                'password' => Hash::make('1234'),
                'telefono' => '987654321',
                'direccion' => 'Avenida Real 456',
                'rol_id' => 2
            ],

            [
                'nombre' => 'Cristian Cabrillas',
                'usuario' => 'cristian',
                'email' => 'cristian@taller.com',
                'password' => Hash::make('1234'),
                'telefono' => '987654321',
                'direccion' => 'Avenida Cabrillas 456',
                'rol_id' => 2
            ],

        ]);
    }
}
