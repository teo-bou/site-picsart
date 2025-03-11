<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    protected $fillable = ['name', 'link_cover', 'published','published_at','event_at'];
    public function photographers()
    {
        return $this->belongsToMany(User::class, 'album_user', 'album_id', 'user_id')
            ->select('users.id', 'users.firstname', 'users.lastname');
    }
}
