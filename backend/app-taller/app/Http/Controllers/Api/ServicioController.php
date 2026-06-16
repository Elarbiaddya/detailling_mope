<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use Illuminate\Http\Request;

class ServicioController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
        $this->middleware('role:admin')->except(['index', 'show']);
    }

    public function index(Request $request)
    {
        $query = Servicio::query();

        if ($request->filled('nombre')) {
            $query->where('nombre', 'like', '%' . $request->nombre . '%');
        }

        $servicios = $query->orderBy('nombre')->paginate(15);

        return response()->json($servicios);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'precio_base' => 'required|numeric|min:0',
        ]);

        $servicio = Servicio::create($data);
        return response()->json($servicio, 201);
    }

    public function show(Servicio $servicio)
    {
        return response()->json($servicio);
    }

    public function update(Request $request, Servicio $servicio)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'precio_base' => 'required|numeric|min:0',
        ]);

        $servicio->update($data);
        return response()->json($servicio);
    }

    public function destroy(Servicio $servicio)
    {
        $servicio->delete();
        return response()->json(null, 204);
    }
}
