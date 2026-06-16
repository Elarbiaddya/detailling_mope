<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    public function index()
    {
        // include user data so client receives vehicle owner details
        return Vehiculo::with('user')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'marca' => 'required|string|max:50',
            'modelo' => 'required|string|max:50',
            'anio' => 'required|integer',
            'matricula' => 'required|string|unique:vehiculos,matricula',
            'bastidor' => 'required|string|max:50',
            'estado' => 'required|string|max:50',
        ]);

        $vehiculo = Vehiculo::create($data);
        return response()->json($vehiculo, 201);
    }

    public function show(Vehiculo $vehiculo)
    {
        return $vehiculo;
    }

    public function update(Request $request, Vehiculo $vehiculo)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'marca' => 'required|string|max:50',
            'modelo' => 'required|string|max:50',
            'anio' => 'required|integer',
            'matricula' => 'required|string|unique:vehiculos,matricula,' . $vehiculo->id,
            'bastidor' => 'required|string|max:50',
            'estado' => 'required|string|max:50',
        ]);

        $vehiculo->update($data);
        return response()->json($vehiculo);
    }

    public function destroy(Vehiculo $vehiculo)
    {
        $vehiculo->delete();
        return response()->json(null, 204);
    }
}
