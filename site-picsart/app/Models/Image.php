<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['link', 'album_id', 'ISO', 'ouverture', 'vitesse_obturation'];
}
