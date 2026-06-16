<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehiculoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('vehiculos')->insert([

            [
                'user_id' => 2,
                'marca' => 'Ford',
                'modelo' => 'Focus',
                'anio' => 2019,
                'matricula' => 'ABC1235',
                'bastidor' => '12345678',
                'estado' => 'en espera'
            ],

            [
                'user_id' => 3,
                'marca' => 'Ford',
                'modelo' => 'Ranger',
                'anio' => 2000,
                'matricula' => 'MA1000CR',
                'bastidor' => '87654321',
                'estado' => 'terminado'
            ],

        ]);
    }
}
