<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AlbumUser;

class CheckAlbumUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $albumId = $request->route('id');
        $userId = Auth::id();

        // Check if the user is associated with the album
        $isAssociated = AlbumUser::where('album_id', $albumId)
                                 ->where('user_id', $userId)
                                 ->exists();

        if (!$isAssociated) {
            return inertia('403', ['message' => 'Unauthorized'])->toResponse($request);
        }

        return $next($request);
    }
}