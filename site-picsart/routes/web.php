<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use App\Http\Controllers\ImageController;

Route::get('/', function () {
    return redirect()->route('albums.index');
});

Route::post('/upload-image', [App\Http\Controllers\ImageController::class, 'store'])->name('image.upload');
Route::post('/upload-album', [App\Http\Controllers\AlbumController::class, 'store'])->name('album.upload');

Route::post('/upload-images', [ImageController::class, 'store']);
Route::post('/delete-images', [ImageController::class, 'deleteMultiple']);

Route::get('/images', function () {
    return Inertia::render('DispImages', [
        'images' => App\Models\Image::all()
    ]);
})->name('images.index');

Route::get('/image/{id}', [App\Http\Controllers\ImageController::class, 'show'])->name('image.show');
Route::get('/download-images', [ImageController::class, 'download'])->name('images.download');
Route::get('/albums/create', function () {
    return Inertia::render('AlbumCreation');
})->name('albums.create');
Route::get('/albums', function () {
    return Inertia::render('DispAlbums', [
        'albums' => App\Models\Album::all()
    ]);
})->name('albums.index');

Route::get('/albums/{id}', function ($id) {
    $album = App\Models\Album::find($id);
    $images = App\Models\Image::where('album_id', $id)->get();
    return Inertia::render('AlbumPage', [
        'album' => $album,
        'images' => $images
    ]);
})->name('albums.show');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
