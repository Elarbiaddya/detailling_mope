<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartaTrabajoController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\MisCitasController;
use App\Http\Controllers\Api\ServicioController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\VehiculoController;
use Illuminate\Support\Facades\Route;

// ─── Auth ────────────────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
});

// ─── Mis citas (usuario autenticado) ──────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/mis-citas',             [MisCitasController::class, 'index']);
    Route::get('/mis-citas/pendiente',   [MisCitasController::class, 'proxima']);
    Route::put('/citas/{cita}/cancelar', [CitaController::class, 'cancelar']);
});

// ─── Admin: anular cita ───────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::put('/citas/{cita}/anular', [CitaController::class, 'anular']);
});

// ─── Recursos existentes (se mantienen, próximos bloques los sustituirán) ────
Route::apiResource('vehiculos',      VehiculoController::class);
Route::apiResource('citas',          CitaController::class);
Route::apiResource('servicios',      ServicioController::class);
Route::apiResource('carta-trabajos', CartaTrabajoController::class);
Route::apiResource('usuarios',       UsuarioController::class);
