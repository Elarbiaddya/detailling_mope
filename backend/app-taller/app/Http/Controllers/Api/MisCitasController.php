<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MisCitasController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $query = Cita::with('servicio')
            ->where('user_id', auth()->id());

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('fecha')) {
            $query->whereDate('fecha', $request->fecha);
        }

        $citas = $query->orderBy('fecha', 'desc')
                       ->orderBy('hora', 'desc')
                       ->paginate(10);

        return response()->json($citas);
    }

    public function proxima()
    {
        $ahora = Carbon::now();

        $cita = Cita::with('servicio')
            ->where('user_id', auth()->id())
            ->where('estado', 'pendiente')
            ->where(function ($q) use ($ahora) {
                $q->where('fecha', '>', $ahora->toDateString())
                  ->orWhere(function ($q2) use ($ahora) {
                      $q2->where('fecha', $ahora->toDateString())
                         ->where('hora', '>=', $ahora->toTimeString());
                  });
            })
            ->orderBy('fecha')
            ->orderBy('hora')
            ->first();

        if (!$cita) {
            return response()->json([
                'data'    => null,
                'message' => 'No tienes citas pendientes próximas.',
            ]);
        }

        return response()->json(['data' => $cita]);
    }
}
