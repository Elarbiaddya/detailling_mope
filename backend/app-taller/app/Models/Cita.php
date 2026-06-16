<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'servicio_id',
        'fecha',
        'hora',
        'motivo',
        'estado',
        'observaciones',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class);
    }

    public function cartaTrabajos()
    {
        return $this->hasMany(CartaTrabajo::class);
    }
}