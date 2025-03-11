<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


use Illuminate\Support\Facades\Auth;


Route::get('/', function () {
    return redirect()->route('albums.index');
});

Route::post('/upload-images', [ImageController::class, 'store']);
Route::post('/delete-images', [ImageController::class, 'deleteMultiple']);
Route::get('/users', [App\Http\Controllers\UserController::class, 'index'])->name('users');
Route::get('/login', [App\Http\Controllers\AuthController::class, 'login'])->name('login');

Route::middleware('auth')->group(function () {
    Route::get('/welcome', function () {
        return Inertia::render('Welcome');
    })->name('welcome');

});

Route::post('/upload-images', [App\Http\Controllers\ImageController::class, 'store'])->name('image.upload');
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

Route::get('/albums/{id}', function ($id) {
    $album = App\Models\Album::find($id);
    $images = App\Models\Image::where('album_id', $id)->get();
    return Inertia::render('AlbumPage', [
        'album' => $album,
        'images' => $images
    ]);
})->name('albums.show');


Route::delete('/albums/{id}', [App\Http\Controllers\AlbumController::class, 'destroy'])->name('albums.destroy');

Route::post('/delete-images', [App\Http\Controllers\ImageController::class, 'deleteMultiple'])->name('images.destroyMultiple');
Route::get('/download-images', [App\Http\Controllers\ImageController::class, 'download'])->name('images.download');

Route::get('/display', function () {
    return response()->json([
        'details' => Auth::user()
    ]);
})->name('display');


require __DIR__.'/auth.php';
