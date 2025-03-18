<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Album;
use App\Models\Image;
use App\Models\AlbumUser;

class AlbumController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string',
            'event_at' => 'required|date',
            'photographers' => 'array',
            'photographers.*.id' => 'integer|exists:users,id'
        ]);

        // Create an album
        $album = new Album();
        $album->name = $request->name;
        $album->event_at = $request->event_at;
        $album->save();

        // Associate photographers with the album
        foreach ($request->photographers as $photographer) {
            AlbumUser::create([
                'album_id' => $album->id,
                'user_id' => $photographer['id']
            ]);
        }

        return response()->json(['message' => 'Album created', 'album' => $album], 201);
    }

    public function show($id)
    {
        $album = Album::find($id);

        return response()->json(['album' => $album], 200);
    }

    public function destroy($id)
    {
        $album = Album::find($id);
        $album->delete();
        return response()->json(['message' => 'Album deleted'], 200);
    }

    public function index()
    {
        $albums = Album::all();
        return response()->json(['albums' => $albums], 200);
    }

    public function get_images($id)
    {
        $images = Image::where('album_id', $id)->get();
        return response()->json(['images' => $images], 200);
    }

    public function setCover(Request $request, $id)
    {
        $album = Album::find($id);
        $album->link_cover = $request->link_cover;
        $album->save();

        return response()->json(['message' => 'Image de couverture mise à jour'], 200);
    }

}
