<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'oauth' => [
        'client_id' => env('OAUTH_CLIENT_ID'),
        'client_secret' => env('OAUTH_CLIENT_SECRET'),
        'redirect_uri' => env('OAUTH_REDIRECT_URI', 'https://sgoogle.com'),
        'scopes' => env('OAUTH_SCOPES', 'users-infos read-assos'),
        'authorize_url' => env('OAUTH_AUTHORIZE_URL', 'https://auth.assos.utc.fr/oauth/authorize'),
        'access_token_url' => env('OAUTH_ACCESS_TOKEN_URL', 'https://auth.assos.utc.fr/oauth/token'),
        'resource' => [
            'owner_details_url' => env('OAUTH_RESOURCE_OWNER_DETAILS', 'https://auth.assos.utc.fr/api/user'),
            'current_associations_url' => env('OAUTH_RESOURCE_CURRENT_ASSOCIATIONS_URL', 'https://auth.assos.utc.fr/api/user/associations/current'),
        ],
        'logout_url' => env('OAUTH_LOGOUT_URL', 'https://auth.assos.utc.fr/logout'),
    ]


];
