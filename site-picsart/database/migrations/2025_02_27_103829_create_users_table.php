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
        Schema::create('users', function (Blueprint $table) {
            $table->id()->primary();
            $table->char('uuid', 36)->comment('Unique ID of each user');
            $table->string('firstname', 100)->comment('First name of each user');
            $table->string('lastname', 100)->comment('Last name of each user');
            $table->string('email', 200)->unique()->comment('Unique email of each user');
            $table->boolean('dark_theme')->default(true)->comment('Dark theme preference of each user');
            $table->string('language', 2)->default('fr')->comment('Language preference of each user');
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable()->comment('Date when it is a deleted user');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('users');
        Schema::enableForeignKeyConstraints();
    }
};
