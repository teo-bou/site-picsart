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
        Schema::table('images', function (Blueprint $table) {
            $table->string('ouverture')->nullable()->change(); // Exemple: 2.8, 11.0
            $table->string('vitesse_obturation')->nullable()->change(); // Exemple: 0.0025 (1/400)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('images', function (Blueprint $table) {
            $table->integer('ouverture')->nullable()->change();
            $table->integer('vitesse_obturation')->nullable()->change();
        });
    }
};
