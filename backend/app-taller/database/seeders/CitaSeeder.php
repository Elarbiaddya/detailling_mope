<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('citas')->insert([

            [
                'user_id' => 2,
                'fecha' => '2025-11-10',
                'hora' => '10:00:00',
                'motivo' => 'Cambio de aceite'
            ],

            [
                'user_id' => 3,
                'fecha' => '2025-11-20',
                'hora' => '11:00:00',
                'motivo' => 'Cambio de frenos'
            ],

        ]);
    }
}
