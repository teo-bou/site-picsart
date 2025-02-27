<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;
use ZipArchive;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,svg'
        ]);

        $paths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('images', 'public');
                $paths[] = $path;

                // Create an image object
                $image = new Image();
                $image->link = $path;
                if($request->album_id)
                    $image->album_id = $request->album_id;
                $image->save();
            }

            return response()->json(['paths' => $paths], 201);
        }

        return response()->json(['error' => 'Images not uploaded'], 400);
    }

    public function show($id)
    {
        $image = Image::findOrFail($id);
        $album_id = $image->album_id;

        return inertia('ImagePage', [
            'image' => $image,
            'album_id' => $album_id,
        ]);
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

    public function deleteMultiple(Request $request)
    {
        $imageIds = $request->input('imageIds');
        Image::whereIn('id', $imageIds)->delete();

        return response()->json(['message' => 'Images deleted successfully'], 200);
    }

    public function download(Request $request)
    {
        $imageIds = explode(',', $request->query('ids'));
        $images = Image::whereIn('id', $imageIds)->get();

        if ($images->isEmpty()) {
            return response()->json(['error' => 'No images found'], 404);
        }

        $zip = new ZipArchive;
        $zipFileName = 'images.zip';
        $zipFilePath = storage_path('app/public/' . $zipFileName);

        if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            foreach ($images as $image) {
                $filePath = storage_path('app/public/' . $image->link);
                $zip->addFile($filePath, basename($filePath));
            }
            $zip->close();
        } else {
            return response()->json(['error' => 'Failed to create zip file'], 500);
        }

        return response()->download($zipFilePath)->deleteFileAfterSend(true);
    }
}
