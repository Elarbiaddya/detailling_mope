<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }

    public function index(Request $request)
    {
        $query = User::with('rol');

        if ($request->filled('nombre')) {
            $query->where('nombre', 'like', '%' . $request->nombre . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        return response()->json($query->orderBy('nombre')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:100',
            'usuario' => 'required|string|max:100|unique:users,usuario',
            'email' => 'nullable|email|max:100',
            'password' => 'required|string|min:4',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:150',
            'rol_id' => 'required|exists:roles,id',
        ]);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        return response()->json($user, 201);
    }

    public function show(User $usuario)
    {
        return response()->json($usuario->load('rol'));
    }

    public function update(Request $request, User $usuario)
    {
        $rules = [
            'nombre' => 'required|string|max:100',
            'usuario' => 'required|string|max:100|unique:users,usuario,' . $usuario->id,
            'email' => 'nullable|email|max:100',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:150',
            'rol_id' => 'required|exists:roles,id',
        ];

        if ($request->filled('password')) {
            $rules['password'] = 'string|min:4';
        }

        $data = $request->validate($rules);
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $usuario->update($data);
        return response()->json($usuario);
    }

    public function destroy(User $usuario)
    {
        $usuario->delete();
        return response()->json(null, 204);
    }
}
