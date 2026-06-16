<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rol;
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
            'rol' => 'required|string|in:admin,cliente',
        ], $this->mensajesValidacion());

        $data['rol_id'] = Rol::where('nombre_rol', $data['rol'])->firstOrFail()->id;
        unset($data['rol']);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        return response()->json($user->load('rol'), 201);
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
            'rol' => 'required|string|in:admin,cliente',
        ];

        if ($request->filled('password')) {
            $rules['password'] = 'string|min:4';
        }

        $data = $request->validate($rules, $this->mensajesValidacion());

        $data['rol_id'] = Rol::where('nombre_rol', $data['rol'])->firstOrFail()->id;
        unset($data['rol']);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $usuario->update($data);
        return response()->json($usuario->load('rol'));
    }

    public function destroy(User $usuario)
    {
        $usuario->delete();
        return response()->json(null, 204);
    }

    private function mensajesValidacion(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio.',
            'usuario.required' => 'El usuario es obligatorio.',
            'usuario.unique' => 'Ese nombre de usuario ya está en uso.',
            'email.email' => 'El email no tiene un formato válido.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 4 caracteres.',
            'rol.required' => 'El rol es obligatorio.',
            'rol.in' => 'El rol debe ser admin o cliente.',
        ];
    }
}
