<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::post('/upload-image', [App\Http\Controllers\ImageController::class, 'store'])->name('image.upload');
Route::post('/upload-album', [App\Http\Controllers\AlbumController::class, 'store'])->name('album.upload');

Route::get('/images', function () {
    return Inertia::render('DispImages', [
        'images' => App\Models\Image::all()
    ]);
})->name('images.index');

Route::get('/images/{id}', [App\Http\Controllers\ImageController::class, 'show'])->name('images.show');
Route::get('/albums/create', function () {
    return Inertia::render('AlbumCreation');
})->name('albums.create');
Route::get('/albums', function () {
    return Inertia::render('DispAlbums', [
        'albums' => App\Models\Album::all()
    ]);
})->name('albums.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
