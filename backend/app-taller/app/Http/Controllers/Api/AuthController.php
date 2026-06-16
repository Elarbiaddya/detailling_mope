<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'nombre'                => 'required|string|max:100',
            'usuario'               => 'required|string|max:100|unique:users,usuario',
            'email'                 => 'required|email|max:100|unique:users,email',
            'password'              => 'required|string|min:6|confirmed',
            'telefono'              => 'nullable|string|max:20',
            'direccion'             => 'nullable|string|max:150',
        ]);

        $rol = Rol::where('nombre_rol', 'cliente')->firstOrFail();

        $user = User::create([
            'nombre'    => $data['nombre'],
            'usuario'   => $data['usuario'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
            'telefono'  => $data['telefono'] ?? null,
            'direccion' => $data['direccion'] ?? null,
            'rol_id'    => $rol->id,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load('rol'),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'usuario'  => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('usuario', $request->usuario)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        // Elimina tokens anteriores para evitar acumulación
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load('rol'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('rol'));
    }
}
