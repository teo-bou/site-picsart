<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\AlbumController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Image;
use App\Models\Album;
use App\Models\AlbumUser;
use App\Models\User;
use App\Models\Photographer;



Route::post('/upload-images', [ImageController::class, 'store']);
Route::post('/delete-images', [ImageController::class, 'deleteMultiple']);
Route::get('/users', [UserController::class, 'index'])->name('users');
Route::get('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth')->group(function () {
    Route::get('/welcome', function () {
        return Inertia::render('Welcome');
    })->name('welcome');
    Route::get('/', function () {
        return redirect()->route('albums.index');
    })->name('home');
});


Route::middleware('check.album.user')->group(function () {
    Route::get('/albums/{id}', function ($id) {
        $album = Album::find($id);
        if ($album->archived) {
            return redirect()->route('archive.show', ['id' => $id]);
        }
        $images = Image::where('album_id', $id)->get();
        
        return Inertia::render('AlbumPage', [
            'album' => $album,
            'images' => $images,
            'photographers' => $album->photographers,
            'userId' => Auth::id()
        ]);
    })->name('albums.show');
    
    Route::delete('/albums/{id}', [AlbumController::class, 'destroy'])->name('albums.destroy');
    
});

Route::get('/archive/{id}', function ($id) {
    $album = Album::find($id);
    $photographers = $album->photographers;

    return Inertia::render('ArchivePage', [
        'album' => $album,
        'photographers' => $photographers
    ]);
})->name('archive.show');

Route::post('/upload-images', [ImageController::class, 'store'])->name('image.upload');
Route::post('/upload-album', [AlbumController::class, 'store'])->name('album.upload');

Route::get('/images', function () {
    return Inertia::render('DispImages', [
        'images' => Image::all()
    ]);
})->name('images.index');

Route::get('/images/{id}', [ImageController::class, 'show'])->name('images.show');

Route::get('/albums-create', function () {
    return Inertia::render('AlbumCreation');
})->name('albums.create');


Route::get('/albums', function () {
    
    return Inertia::render('DispAlbums', [
        'albums_user' => Album::whereIn('id', AlbumUser::where('user_id', Auth::id())->pluck('album_id'))->get(),
        'albums' => Album::all(),
        'user' => Auth::user()   
    ]);
})->name('albums.index');


Route::post('/albums/{id}/set-cover', [AlbumController::class, 'setCover'])->name('albums.setCover');

Route::post('/albums/{id}/archive', [AlbumController::class, 'archive'])->name('albums.archive');

Route::post('/delete-images', [ImageController::class, 'deleteMultiple'])->name('images.destroyMultiple');
Route::get('/download-images', [ImageController::class, 'download'])->name('images.download');

Route::get('/download-archive/{id}', [AlbumController::class, 'download'])->name('archive.download');

Route::get('/display', function () {
    return response()->json([
        'details' => Auth::user()
    ]);
})->name('display');

Route::get('/albums/photographer/{id}', [AlbumController::class, 'getAlbumsByPhotographer'])->name('albums.photographer');


Route::get('/login-user/{id}', function(
    $id
) {
    $user = User::find($id);

        if ($user) {
            Auth::login($user);
        }
        return redirect()->route('home');
})->name('login.user');



require __DIR__.'/auth.php';
