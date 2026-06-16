<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartaTrabajo extends Model
{
    use HasFactory;

    protected $fillable = [
        'cita_id',
        'vehiculo_id',
        'servicio_id',
        'horas_trabajadas',
        'detalles',
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class);
    }

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class);
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class);
    }
}