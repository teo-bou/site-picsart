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
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('link');
            $table->foreignId('album_id');
            $table->integer('ISO')->nullable();
            $table->string('ouverture')->nullable();
            $table->string('vitesse_obturation')->nullable();
            $table->foreignId('photographer_id')
            ->nullable()
            ->constrained('users');
            ->nullOnDelete(); 
        });
    }

    /**
     * Reverse the migrations.
     */

    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
