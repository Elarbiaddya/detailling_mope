<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicioSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('servicios')->insert([

            [
                'nombre'      => 'Limpieza interior profunda',
                'descripcion' => 'La limpieza interior profunda incluye aspirado completo de alfombras y tapicería, limpieza de plásticos y salpicadero con productos específicos, tratamiento de manchas en asientos, eliminación de olores y acabado final en todos los paneles interiores. Es un servicio pensado para recuperar el aspecto original del habitáculo y dejar el vehículo como el primer día.',
                'precio_base' => 60.00,
                'duracion'    => 90,
                'imagen'      => '/servicios/limpieza-interior.png',
            ],

            [
                'nombre'      => 'Limpieza exterior premium',
                'descripcion' => 'La limpieza exterior premium consiste en un lavado a mano con productos de alta gama, limpieza de llantas y arcos de rueda, tratamiento de plásticos exteriores, secado con microfibra y abrillantado de cristales. El resultado es una carrocería limpia, brillante y sin marcas de agua, lista para cualquier ocasión.',
                'precio_base' => 45.00,
                'duracion'    => 60,
                'imagen'      => '/servicios/limpieza-exterior.png',
            ],

            [
                'nombre'      => 'Limpieza completa interior y exterior',
                'descripcion' => 'La limpieza completa combina todos los tratamientos del servicio interior profundo con el lavado exterior premium en una sola sesión. Incluye aspirado, limpieza de plásticos, tratamiento de tapicería, lavado a mano de la carrocería, limpieza de llantas y acabado con abrillantador. Ideal para una puesta a punto total del vehículo.',
                'precio_base' => 95.00,
                'duracion'    => 150,
                'imagen'      => '/servicios/limpieza-completa.png',
            ],

            [
                'nombre'      => 'Pulido y abrillantado de carrocería',
                'descripcion' => 'El pulido y abrillantado de carrocería elimina arañazos superficiales, marcas de lavados anteriores y oxidación leve de la pintura. Se aplica mediante máquina pulidora con compuestos abrasivos y de afinado, finalizando con un sellador de pintura que devuelve el brillo original. El resultado es una carrocería uniforme, profunda y protegida.',
                'precio_base' => 130.00,
                'duracion'    => 180,
                'imagen'      => null,
            ],

            [
                'nombre'      => 'Protección cerámica',
                'descripcion' => 'La protección cerámica es el tratamiento más avanzado para la carrocería. Se aplica una capa de recubrimiento cerámico que forma una barrera duradera contra la suciedad, la lluvia ácida, los rayos UV y los arañazos leves. El efecto hidrofóbico hace que el agua resbale dejando la pintura siempre limpia. La protección puede durar entre 1 y 3 años según el uso y el mantenimiento.',
                'precio_base' => 220.00,
                'duracion'    => 240,
                'imagen'      => null,
            ],

            [
                'nombre'      => 'Pulido de faros',
                'descripcion' => 'El pulido de faros restaura la transparencia de los focos deteriorados por la oxidación y el desgaste. Mediante un proceso de lijado progresivo y pulido con productos específicos, se elimina la capa amarillenta que reduce la visibilidad y el aspecto estético del vehículo. El tratamiento incluye una capa de sellador UV para prolongar el resultado.',
                'precio_base' => 40.00,
                'duracion'    => 60,
                'imagen'      => '/servicios/pulido-faros.jpg',
            ],

            [
                'nombre'      => 'Tintado de faros traseros',
                'descripcion' => 'El tintado de faros traseros consiste en la aplicación de una lámina o aerosol tintado de alta calidad sobre los pilotos, consiguiendo un acabado oscurecido muy popular en el mundo del tuning y el detailing estético. El proceso es reversible y no daña la óptica original. Se trabaja con materiales homologados para uso en vía pública.',
                'precio_base' => 70.00,
                'duracion'    => 90,
                'imagen'      => '/servicios/tintado-faros-traseros.jpg',
            ],

            [
                'nombre'      => 'Limpieza de motor',
                'descripcion' => 'La limpieza de motor se realiza con desengrasantes específicos y equipos de vapor o presión controlada para eliminar el aceite acumulado, el polvo y la suciedad del compartimento del motor. El resultado es un motor limpio y con mejor disipación de calor, además de facilitar la detección de posibles fugas. El proceso incluye la protección de elementos electrónicos sensibles.',
                'precio_base' => 50.00,
                'duracion'    => 75,
                'imagen'      => '/servicios/limpieza-motores.jpg',
            ],

        ]);
    }
}
