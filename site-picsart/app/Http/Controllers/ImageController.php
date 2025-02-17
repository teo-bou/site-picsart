<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;


class ImageController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg'
        ]);

        // Store the image
        if ($request->file('image')) {
            $path = $request->file('image')->store('images', 'public');

            // Create an image object
            $image = new Image();
            $image->link = $path;
            if($request->album_id)
                $image->album_id = $request->album_id;
            $image->save();

            return response()->json(['path' => $path], 201);
        }

        return response()->json(['error' => 'Image not uploaded'], 400);
    }

    public function show($id)
    {
        $image = Image::find($id);

        return inertia('ImagePage', ['image' => asset('storage/' . $image->link)]);
    }

    public function destroy($id)
    {
        $image = Image::find($id);
        $image->delete();
        return response()->json(['message' => 'Image deleted'], 200);
    }

    public function index()
    {
        $images = Image::all();
        return response()->json(['images' => $images], 200);
    }
}
