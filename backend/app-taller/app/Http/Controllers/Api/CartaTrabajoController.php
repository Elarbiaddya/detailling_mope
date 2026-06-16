<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartaTrabajo;
use Illuminate\Http\Request;

class CartaTrabajoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    public function index()
    {
        // eager‑load all related models so client has full context
        return CartaTrabajo::with(['cita','vehiculo','servicio'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'vehiculo_id' => 'required|exists:vehiculos,id',
            'servicio_id' => 'required|exists:servicios,id',
            'horas_trabajadas' => 'required|numeric|min:0',
            'detalles' => 'nullable|string',
        ]);

        $carta = CartaTrabajo::create($data);
        return response()->json($carta, 201);
    }

    public function show(CartaTrabajo $cartaTrabajo)
    {
        return $cartaTrabajo;
    }

    public function update(Request $request, CartaTrabajo $cartaTrabajo)
    {
        $data = $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'vehiculo_id' => 'required|exists:vehiculos,id',
            'servicio_id' => 'required|exists:servicios,id',
            'horas_trabajadas' => 'required|numeric|min:0',
            'detalles' => 'nullable|string',
        ]);

        $cartaTrabajo->update($data);
        return response()->json($cartaTrabajo);
    }

    public function destroy(CartaTrabajo $cartaTrabajo)
    {
        $cartaTrabajo->delete();
        return response()->json(null, 204);
    }
}
