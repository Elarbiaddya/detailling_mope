<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carta_trabajos', function (Blueprint $table) {
        $table->id();

        $table->foreignId('cita_id')
              ->constrained('citas')
              ->onDelete('cascade');

        $table->foreignId('vehiculo_id')
              ->constrained('vehiculos')
              ->onDelete('cascade');

        $table->foreignId('servicio_id')
              ->constrained('servicios')
              ->onDelete('cascade');

        $table->decimal('horas_trabajadas', 5, 2)->default(0);
        $table->text('detalles')->nullable();

        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carta_trabajos');
    }
};
