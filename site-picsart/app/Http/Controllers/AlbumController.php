<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

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

    public function download($id)
    {
        $album = Album::find($id);
        $archivePath = storage_path('app/public/' . $album->link_archive);

        if (file_exists($archivePath)) {
            return response()->download($archivePath)->deleteFileAfterSend(false);
        } else {
            return response()->json(['message' => 'Archive not found'], 404);
        }
    }

    public function archive($id)
    {
        $album = Album::find($id);
        $images = Image::where('album_id', $id)->get();
        $coverImageLink = $album->link_cover;

        $zip = new ZipArchive;
        $zipFileName = 'archive_' . $album->name . '_' . $album->semestre .'.zip';
        $zipFilePath = storage_path('app/public/archives/' . $zipFileName);

        // Ensure the directory exists
        if (!file_exists(storage_path('app/public/archives'))) {
            mkdir(storage_path('app/public/archives'), 0777, true);
        }

        if ($zip->open($zipFilePath, ZipArchive::CREATE) === TRUE) {
            foreach ($images as $image) {
                $filePath = storage_path('app/public/' . $image->link);
                if (file_exists($filePath)) {
                    $zip->addFile($filePath, basename($filePath));
                } else if (!file_exists($filePath)) {
                    return response()->json(['message' => 'File does not exist: ' . $filePath], 500);
                }
            }
            $zip->close();

            // Update album
            $album->archived = true;
            $album->link_archive = 'storage/archives/' . $zipFileName;
            $album->save();

            // Delete images from storage except the cover image
            foreach ($images as $image) {
                if ($image->link !== $coverImageLink) {
                    $imagePath = storage_path('app/public/' . $image->link);
                    if (file_exists($imagePath)) {
                        unlink($imagePath); // Suppression avec unlink
                    }
                }
                $image->delete();
            }

            return response()->json(['message' => 'Album archived', 'album' => $album], 200);
        } else {
            return response()->json(['message' => 'Failed to create archive at: ' . $zipFilePath], 500);
        }
    }

}
