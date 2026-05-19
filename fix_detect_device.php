<?php

$content = <<<'EOT'
<?php

namespace App\Listeners;

use App\Models\Device;
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
        } elseif (stripos($ua, 'Android') !== false) {
            $type = 'android';
            $name = 'Android Device';
        } elseif (stripos($ua, 'Macintosh') !== false || stripos($ua, 'Mac OS X') !== false) {
            $type = 'mac';
            $name = 'Mac';
        } elseif (stripos($ua, 'Windows') !== false) {
            $type = 'windows';
            $name = 'Windows PC';
        } else {
            $type = 'windows';
            $name = 'Unknown Device';
        }

        $exists = Device::where('user_id', $event->user->id)
            ->where('type', $type)
            ->exists();

        if (!$exists) {
            Device::create([
                'user_id'    => $event->user->id,
                'name'       => $name,
                'type'       => $type,
                'identifier' => $request->ip(),
            ]);
        }
    }
}
EOT;

file_put_contents('app/Listeners/DetectUserDevice.php', $content);
echo "Done! DetectUserDevice written successfully.\n";
