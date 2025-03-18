<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;
use ZipArchive;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ImageController extends Controller
{
    public function store(Request $request)
    {

        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,svg,webp'
        ]);

        $paths = [];
        $excludedFiles = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                // Check if the file size is less than 10MB
                if ($file->getSize() > 10 * 1024 * 1024) {
                    $excludedFiles[] = $file->getClientOriginalName();
                    continue;
                }

                // Check if the file type is supported for EXIF data extraction
                $supportedTypes = ['jpeg', 'jpg', 'tiff'];
                $fileExtension = strtolower($file->getClientOriginalExtension());

                if (in_array($fileExtension, $supportedTypes)) {
                    // Extract metadata
                    $exif = exif_read_data($file);
                    if ($exif === false) {
                        error_log('Failed to read EXIF data from: ' . $file->getClientOriginalName());
                        $iso = null;
                        $ouverture = null;
                        $vitesse_obturation = null;
                    } else {
                        error_log(json_encode($exif));
                        $iso = $exif['ISOSpeedRatings'] ?? null;
                        $ouverture = $exif['COMPUTED']['ApertureFNumber'] ?? null;
                        $vitesse_obturation = $exif['ExposureTime'] ?? null;
                    }
                } else {
                    $iso = null;
                    $ouverture = null;
                    $vitesse_obturation = null;
                }

                $fileName = uniqid() . '.' . $fileExtension;
                $path = $file->storeAs('/images', $fileName, 'public');
                $paths[] = str_replace('public/', '', $path);

                Image::create([
                    'link' => str_replace('public/', '', $path),
                    'album_id' => $request->album_id ?? null,
                    'ISO' => $iso,
                    'ouverture' => $ouverture,
                    'vitesse_obturation' => $vitesse_obturation,
                    'photographer_id' => $request->user_id,
                ]);
            }

            $response = ['paths' => $paths];
            if (!empty($excludedFiles)) {
                $response['excluded_files'] = $excludedFiles;
            }

            return response()->json($response, 201);
        }
        return response()->json(['error' => 'Images not uploaded'], 400);
    }
    
    private function compressImage($source, $destination)
    {
        $info = getimagesize($source);
        $initialSize = filesize($source);
        
        // Ajustement de la qualité/compression selon la taille du fichier
        if ($initialSize > 10 * 1024 * 1024) { // Plus de 5 Mo
            $quality = 40;
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
        $photographer_id = $image->photographer_id;
        $photographer = $image->photographer_id ? User::find($photographer_id) : null;
        $photographerName = $photographer ? $photographer->firstname . ' ' . $photographer->lastname : null;

        return inertia('ImagePage', [
            'image' => $image,
            'album_id' => $album_id,
            'photographer' => $photographerName
            

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
