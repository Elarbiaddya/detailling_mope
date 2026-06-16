<?php

namespace App\Services;

use App\Models\Tarea;

class TareaService
{
    public function crearTarea(array $datos): Tarea
    {
        return Tarea::create($datos);
    }
}