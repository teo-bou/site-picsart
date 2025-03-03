<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;



class User extends Authenticatable
{
    protected $fillable = ['uuid', 'firstname', 'lastname', 'email',  'dark_theme', 'language', 'created_at', 'updated_at', 'deleted_at'];


}
