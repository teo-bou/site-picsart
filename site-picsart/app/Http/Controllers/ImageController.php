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
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,svg,webp'
        ]);
    
        $paths = [];
    
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $compressedPath = storage_path('app/public/images/' . uniqid() . '.' . $file->getClientOriginalExtension());
                $this->compressImage($file->getPathname(), $compressedPath);
                $path = str_replace(storage_path('app/public/'), '', $compressedPath);
                $paths[] = $path;
                Image::create(['link' => $path, 'album_id' => $request->album_id ?? null]);
            }
            return response()->json(['paths' => $paths], 201);
        }
        return response()->json(['error' => 'Images not uploaded'], 400);
    }
    
    private function compressImage($source, $destination)
    {
        $info = getimagesize($source);
        $initialSize = filesize($source);
        
        // Ajustement de la qualité/compression selon la taille du fichier
        if ($initialSize > 10 * 1024 * 1024) { // Plus de 5 Mo
            $quality = 50;
            $compressionLevel = 8;
        } elseif ($initialSize > 3 * 1024 * 1024) { // Entre 2 et 5 Mo
            $quality = 70;
            $compressionLevel = 6;
        } else { // Moins de 2 Mo
            $quality = 85;
            $compressionLevel = 4;
        }
        
        if ($info['mime'] == 'image/jpeg') {
            $image = imagecreatefromjpeg($source);
            imagejpeg($image, $destination, $quality);
        } elseif ($info['mime'] == 'image/png') {
            $image = imagecreatefrompng($source);
            imagepng($image, $destination, $compressionLevel);
        } elseif ($info['mime'] == 'image/webp') {
            $image = imagecreatefromwebp($source);
            imagewebp($image, $destination, $quality);
        } else {
            return;
        }
        
        imagedestroy($image);
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
