<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class LogActivity
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        try {
            if (Schema::hasTable('activity_logs')) {
                DB::table('activity_logs')->insert([
                    'user_id'     => $request->user()?->id,
                    'method'      => $request->method(),
                    'path'        => $request->path(),
                    'ip'          => $request->ip(),
                    'status_code' => $response->getStatusCode(),
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }
        } catch (\Exception $e) {
            // never crash the app due to logging
        }

        return $response;
    }
}