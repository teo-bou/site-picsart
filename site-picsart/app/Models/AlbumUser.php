<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlbumUser extends Model
{
    protected $table = 'album_user';

    protected $fillable = ['user_id', 'album_id'];

    public $timestamps = false;

    // Define the relationship with the Album model
    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
