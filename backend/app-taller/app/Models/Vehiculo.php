<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'marca',
        'modelo',
        'anio',
        'matricula',
        'bastidor',
        'estado',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cartaTrabajos()
    {
        return $this->hasMany(CartaTrabajo::class);
    }
}