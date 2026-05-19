<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $fillable = [
        'asset_number', 'name', 'type', 'serial_number', 'device_platform',
        'vendor', 'department', 'location', 'purchase_price', 'purchase_date',
        'warranty_expiry', 'status', 'notes', 'user_id',
    ];

    protected $casts = [
        'purchase_date'   => 'date',
        'warranty_expiry' => 'date',
        'purchase_price'  => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logs()
    {
        return $this->hasMany(\App\Models\AssetLog::class)->latest();
    }

    public function depreciation()
    {
        return $this->hasOne(\App\Models\AssetDepreciation::class);
    }

    /**
     * Map asset type to device type for syncing to devices table.
     * Returns null if asset type is not a device.
     */
    public static function assetTypeToDeviceType(string $type, ?string $platform = null): ?string
    {
        if ($platform && in_array($platform, ['mac', 'ios', 'android', 'windows'])) {
            return $platform;
        }
        return match(strtolower($type)) {
            'phone'   => 'ios',
            'tablet'  => 'ios',
            'android' => 'android',
            default   => null,
        };
    }
}