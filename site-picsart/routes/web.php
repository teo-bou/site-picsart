<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::post('/upload-image', [App\Http\Controllers\ImageController::class, 'store'])->name('image.upload');

Route::get('/images', function () {
    return Inertia::render('DispImages', [
        'images' => App\Models\Image::all()
    ]);
})->name('images.index');

Route::get('/images/{id}', [App\Http\Controllers\ImageController::class, 'show'])->name('images.show');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
