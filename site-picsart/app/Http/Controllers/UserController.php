<?php

namespace App\Http\Controllers;
use App\Models\User;

use Illuminate\Http\Request;

class UserController extends Controller
{   

    public function createOrUpdateUser($userDetails, $currentAssociations)
    {
        // $role = RoleEnum::USER->value;

        // $userRoles = json_decode(file_get_contents(storage_path(config('filesystems.storage_path.user_roles'))), true);

        // if ($currentAssociations != null) {
        //     foreach ($currentAssociations as $association) {
        //         foreach ($userRoles as $userRole) {
        //             if ($association['login'] === $userRole['association'] && $association['user_role']['type'] === $userRole['role']) {
        //                 $role = RoleEnum::ADMINISTRATOR->value;
        //                 break 2;
        //             }
        //         }
        //     }
        // }


        $user = User::updateOrCreate(
            ['uuid' => $userDetails['uuid']],
            [
                'firstname' => $userDetails['firstName'],
                'lastname' => $userDetails['lastName'],
                'email' => $userDetails['email'],

            ]
        );

        return $user;
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['user' => $user], 200);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        $user->delete();
        return response()->json(['message' => 'User deleted'], 200);
    }

    public function index()
    {
        $users = User::all();
        return response()->json(['users' => $users], 200);
    }


    
}
