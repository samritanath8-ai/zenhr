<?php

use App\Http\Controllers\DashboardController;

Route::get('/dashboard/metrics',      [DashboardController::class, 'metrics']);
Route::get('/dashboard/activity',     [DashboardController::class, 'activity']);
Route::get('/dashboard/recent-users', [DashboardController::class, 'recentUsers']);
Route::get('/dashboard/status',       [DashboardController::class, 'status']);