<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'is_enabled', 'notification_preferences', 'email_verified_at',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at'          => 'datetime',
            'password'                   => 'hashed',
            'is_enabled'                 => 'boolean',
            'notification_preferences'   => 'array',
        ];
    }

    public function devices()
    {
        return $this->hasMany(\App\Models\Device::class);
    }

    public function assets()
    {
        return $this->hasMany(\App\Models\Asset::class);
    }

    public function prefersNotification(string $key): bool
    {
        $prefs = $this->notification_preferences ?? [];
        return $prefs[$key] ?? true;
    }
}
