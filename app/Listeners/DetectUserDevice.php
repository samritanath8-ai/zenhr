<?php

namespace App\Listeners;

use App\Models\Device;
use App\Models\Asset;
use Illuminate\Auth\Events\Login;

class DetectUserDevice
{
    public function handle(Login $event): void
    {
        $request = request();
        $ua = $request->userAgent() ?? '';

        if (stripos($ua, 'iPhone') !== false || stripos($ua, 'iPad') !== false) {
            $type = 'ios';
            $name = stripos($ua, 'iPad') !== false ? 'iPad' : 'iPhone';
            $assetType = 'Phone';
        } elseif (stripos($ua, 'Android') !== false) {
            $type = 'android';
            $name = 'Android Device';
            $assetType = 'Phone';
        } elseif (stripos($ua, 'Macintosh') !== false || stripos($ua, 'Mac OS X') !== false) {
            $type = 'mac';
            $name = 'Mac';
            $assetType = 'Laptop';
        } elseif (stripos($ua, 'Windows') !== false) {
            $type = 'windows';
            $name = 'Windows PC';
            $assetType = 'Laptop';
        } else {
            $type = 'windows';
            $name = 'Unknown Device';
            $assetType = 'Laptop';
        }

        // create device record if not exists
        $deviceExists = Device::where('user_id', $event->user->id)
            ->where('type', $type)
            ->exists();

        if (!$deviceExists) {
            Device::create([
                'user_id'    => $event->user->id,
                'name'       => $name,
                'type'       => $type,
                'identifier' => $request->ip(),
            ]);
        }

        // auto-create asset record if not exists
        $assetExists = Asset::where('user_id', $event->user->id)
            ->where('name', $name)
            ->exists();

        if (!$assetExists) {
            $assetNumber = 'AUTO-' . strtoupper(substr($type, 0, 3)) . '-' . $event->user->id . '-' . time();

            Asset::create([
                'asset_number'    => $assetNumber,
                'name'            => $name,
                'type'            => $assetType,
                'device_platform' => $type,
                'serial_number'   => null,
                'vendor'          => null,
                'status'          => 'assigned',
                'user_id'         => $event->user->id,
                'notes'           => 'Auto-detected on login from IP ' . $request->ip(),
            ]);
        }
    }
}