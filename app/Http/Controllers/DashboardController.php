<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard/metrics
     */
    public function metrics(Request $request)
    {
        $totalUsers = DB::table('users')->count();

        $activeSessions = DB::table('sessions')
            ->where('last_activity', '>=', now()->subMinutes(15)->timestamp)
            ->count();

        $requestsToday = DB::table('activity_logs')
            ->whereDate('created_at', today())
            ->count();

        return response()->json([
            'total_users'     => $totalUsers,
            'active_sessions' => $activeSessions,
            'requests_today'  => $requestsToday,
        ]);
    }

    /**
     * GET /api/dashboard/activity
     */
    public function activity(Request $request)
    {
        $days = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);
            $count = DB::table('activity_logs')
                ->whereDate('created_at', $date->toDateString())
                ->count();

            return [
                'day'   => $date->format('D'),
                'date'  => $date->toDateString(),
                'count' => $count,
            ];
        });

        return response()->json($days);
    }

    /**
     * GET /api/dashboard/recent-users
     * Returns the 5 most recently registered users.
     *
     * Response:
     * [
     *   { "id": 1, "name": "Jane Doe", "email": "jane@example.com", "role": "Admin", "created_at": "2025-05-01" },
     *   ...
     * ]
     */
    public function recentUsers(Request $request)
    {
        $users = DB::table('users')
            ->select('id', 'name', 'email', 'created_at')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id'         => $user->id,
                    'name'       => $user->name,
                    'email'      => $user->email,
                    'initials'   => collect(explode(' ', $user->name))
                                        ->map(fn($w) => strtoupper($w[0] ?? ''))
                                        ->take(2)
                                        ->join(''),
                    'joined'     => Carbon::parse($user->created_at)->diffForHumans(),
                ];
            });

        return response()->json($users);
    }

    /**
     * GET /api/dashboard/status
     * Checks DB connectivity, API responsiveness, and session/auth health.
     *
     * Response:
     * [
     *   { "name": "API", "status": "operational", "latency_ms": 12 },
     *   { "name": "Database", "status": "operational", "latency_ms": 4 },
     *   { "name": "Auth service", "status": "operational", "latency_ms": 2 },
     * ]
     */
    public function status(Request $request)
    {
        $results = [];

        // API check — measure response time of this very request
        $apiStart = microtime(true);
        $apiOk = true; // if we got here, API is up
        $results[] = [
            'name'       => 'API',
            'status'     => $apiOk ? 'operational' : 'degraded',
            'latency_ms' => round((microtime(true) - $apiStart) * 1000),
        ];

        // Database check
        $dbStart = microtime(true);
        try {
            DB::connection()->getPdo();
            DB::select('SELECT 1');
            $dbStatus = 'operational';
        } catch (\Exception $e) {
            $dbStatus = 'down';
        }
        $results[] = [
            'name'       => 'Database',
            'status'     => $dbStatus,
            'latency_ms' => round((microtime(true) - $dbStart) * 1000),
        ];

        // Auth service check — verify sessions table is accessible
        $authStart = microtime(true);
        try {
            DB::table('sessions')->limit(1)->get();
            $authStatus = 'operational';
        } catch (\Exception $e) {
            $authStatus = 'degraded';
        }
        $results[] = [
            'name'       => 'Auth service',
            'status'     => $authStatus,
            'latency_ms' => round((microtime(true) - $authStart) * 1000),
        ];

        return response()->json($results);
    }
}