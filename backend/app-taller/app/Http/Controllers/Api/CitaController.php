<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use Carbon\Carbon;
use Illuminate\Http\Request;


class CitaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin')->only(['index', 'update', 'destroy']);
    }

    public function index(Request $request)
    {
        $query = Cita::with(['user', 'servicio']);

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('fecha')) {
            $query->whereDate('fecha', $request->fecha);
        }

        return response()->json($query->orderBy('fecha', 'desc')->orderBy('hora', 'desc')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'servicio_id' => 'required|exists:servicios,id',
            'fecha'       => 'required|date|after_or_equal:today',
            'hora'        => 'required|date_format:H:i',
            'motivo'      => 'nullable|string|max:500',
        ]);

        $data['user_id'] = auth()->id();
        $data['estado']  = 'pendiente';

        $cita = Cita::with('servicio')->create($data);
        return response()->json(['data' => $cita->fresh('servicio')], 201);
    }

    public function show(Cita $cita)
    {
        return $cita;
    }

    public function update(Request $request, Cita $cita)
    {
        $data = $request->validate([
            'servicio_id'   => 'sometimes|exists:servicios,id',
            'fecha'         => 'required|date',
            'hora'          => 'required|date_format:H:i',
            'motivo'        => 'nullable|string|max:500',
            'estado'        => 'required|string|in:pendiente,confirmada,completada,anulada',
            'observaciones' => 'nullable|string',
        ]);

        $cita->update($data);
        return response()->json($cita->fresh(['user', 'servicio']));
    }

    public function destroy(Cita $cita)
    {
        $cita->delete();
        return response()->json(null, 204);
    }

    public function anular(Cita $cita)
    {
        if ($cita->estado === 'anulada') {
            return response()->json(['message' => 'La cita ya está anulada.'], 422);
        }

        $cita->update(['estado' => 'anulada']);

        return response()->json([
            'message' => 'Cita anulada correctamente.',
            'data'    => $cita->fresh(['user', 'servicio']),
        ]);
    }

    public function cancelar(Cita $cita)
    {
        if ($cita->user_id !== auth()->id()) {
            return response()->json(['message' => 'No tienes permiso para cancelar esta cita.'], 403);
        }

        if ($cita->estado !== 'pendiente') {
            return response()->json(['message' => 'Solo se pueden cancelar citas en estado pendiente.'], 422);
        }

        $fechaHora = Carbon::parse($cita->fecha . ' ' . $cita->hora);
        if (!$fechaHora->isAfter(now()->addHours(24))) {
            return response()->json(['message' => 'No se puede cancelar con menos de 24 horas de antelación.'], 422);
        }

        $cita->update(['estado' => 'anulada']);

        return response()->json([
            'message' => 'Cita cancelada correctamente.',
            'data'    => $cita->fresh('servicio'),
        ]);
    }
}
