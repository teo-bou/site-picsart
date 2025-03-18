<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    public function photographer()
    {
        return $this->belongsTo(User::class, 'photographer_id');
    }

    protected $fillable = ['link', 'album_id', 'ISO', 'ouverture', 'vitesse_obturation', 'photographer_id'];
}
