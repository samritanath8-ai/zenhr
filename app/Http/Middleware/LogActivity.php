<?php

// app/Http/Middleware/LogActivity.php
// Run: php artisan make:middleware LogActivity
// Register in app/Http/Kernel.php under $middlewareGroups['api']

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Skip logging for the dashboard endpoints themselves (avoid infinite counting)
        if (str_starts_with($request->path(), 'api/dashboard')) {
            return $response;
        }

        DB::table('activity_logs')->insert([
            'user_id'     => $request->user()?->id,
            'method'      => $request->method(),
            'path'        => $request->path(),
            'ip'          => $request->ip(),
            'status_code' => $response->getStatusCode(),
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        return $response;
    }
}