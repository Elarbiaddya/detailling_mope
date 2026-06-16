<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CartaTrabajoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('carta_trabajos')->insert([
            [
                'cita_id' => 1,
                'vehiculo_id' => 1,
                'servicio_id' => 1,
                'horas_trabajadas' => 3.0,
                'detalles' => 'Cambio de aceite y revisión general'
            ]
        ]);
    }
}
