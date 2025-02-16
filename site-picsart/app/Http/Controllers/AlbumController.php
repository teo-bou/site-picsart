<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Album;
use App\Models\Image;


class AlbumController extends Controller
{
    public function store(Request $request)
    {   echo $request;
        // Validate the request
        $request->validate([
            'name' => 'required|string',
        ]);

        // Create an album
        $album = new Album();
        $album->name = $request->name;
        $album->save();

        return response()->json(['message' => 'Album created'], 201);
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
}
