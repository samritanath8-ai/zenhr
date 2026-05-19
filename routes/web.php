<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Models\User;

/* HOME */
Route::get('/', fn() => inertia('auth/login'))->name('home');

/* LOGIN */
Route::get('/login', fn() => inertia('auth/login'))->name('login');
Route::post('/login', function (Request $request) {
})->name('login.store');
    $request->validate(['email' => ['required', 'email'], 'password' => ['required']]);
    if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
        if (!Auth::user()->is_enabled) {
            Auth::logout();
            return back()->withErrors(['email' => 'Your account has been disabled. Contact your administrator.']);
        }
        $request->session()->regenerate();
        return redirect()->intended('/dashboard');
    }
    return back()->withErrors(['email' => 'These credentials do not match our records.']);
});

/* REGISTER */
Route::get('/register', fn() => inertia('auth/register'))->name('register');
Route::post('/register', function (Request $request) {
    $validated = $request->validate([
        'name'     => ['required', 'string', 'max:255'],
        'email'    => ['required', 'email', 'max:255', 'unique:users'],
        'password' => ['required', 'confirmed', Password::min(8)],
    ]);
    $user = User::create(['name' => $validated['name'], 'email' => $validated['email'], 'password' => Hash::make($validated['password'])]);
    Auth::login($user);
    return redirect('/dashboard');
})->name('register.store');

/* LOGOUT */
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect()->route('home');
})->name('logout');

/* ALL AUTHENTICATED ROUTES */
Route::middleware('auth')->group(function () {

Route::delete('/profile', function (Request $request) {
    $request->validate(['password' => ['required']]);
    $user = Auth::user();
    if (! \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return back()->withErrors(['password' => 'The provided password is incorrect.']);
    }
    Auth::logout();
    $user->delete();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect()->route('home');
})->name('profile.destroy');

Route::get('/settings/security', function () {
    return inertia('settings/security', [
        'canManageTwoFactor' => \Laravel\Fortify\Features::enabled(\Laravel\Fortify\Features::twoFactorAuthentication()),
    ]);
})->name('security.edit');

    /* DASHBOARD */
    Route::get('/dashboard', function () {
        return inertia('dashboard', [
            'totalUsers'      => \App\Models\User::count(),
            'totalAssets'     => \App\Models\Asset::count(),
            'assignedAssets'  => \App\Models\Asset::where('status', 'assigned')->count(),
            'availableAssets' => \App\Models\Asset::where('status', 'available')->count(),
            'inRepairAssets'  => \App\Models\Asset::where('status', 'in-repair')->count(),
            'expiringAssets'  => \App\Models\Asset::whereNotNull('warranty_expiry')
                                    ->where('warranty_expiry', '<=', now()->addDays(30))
                                    ->where('warranty_expiry', '>=', now())->count(),
        ]);
    })->name('dashboard');

    /* ------------------------------------------------------------------ */
    /* DEPRECIATION                                                         */
    /* ------------------------------------------------------------------ */
    Route::get('/depreciation', function () {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        $depreciations = \App\Models\AssetDepreciation::with('asset')->get()->map(function ($d) {
            $calc = $d->calculate();
            return [
                'id' => $d->id, 'asset_id' => $d->asset_id,
                'asset_number' => $d->asset->asset_number, 'asset_name' => $d->asset->name,
                'asset_type' => $d->asset->type, 'method' => $d->method,
                'purchase_price' => $d->purchase_price, 'salvage_value' => $d->salvage_value,
                'useful_life_years' => $d->useful_life_years, 'declining_rate' => $d->declining_rate,
                'total_units' => $d->total_units, 'units_used' => $d->units_used,
                'depreciation_start' => $d->depreciation_start,
                'book_value' => $calc['book_value'], 'accumulated' => $calc['accumulated'], 'percent_used' => $calc['percent_used'],
            ];
        });
        $assets = \App\Models\Asset::whereNotNull('purchase_price')->whereDoesntHave('depreciation')
            ->orderBy('name')->get(['id', 'name', 'asset_number', 'purchase_price', 'purchase_date']);
        return inertia('depreciation/index', compact('depreciations', 'assets'));
    })->name('depreciation.index');

    Route::post('/depreciation', function (Request $request) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        $validated = $request->validate([
            'asset_id'           => ['required', 'exists:assets,id', 'unique:asset_depreciations,asset_id'],
            'method'             => ['required', 'in:straight_line,declining_balance,units_of_production'],
            'purchase_price'     => ['required', 'numeric', 'min:0'],
            'salvage_value'      => ['nullable', 'numeric', 'min:0'],
            'useful_life_years'  => ['nullable', 'integer', 'min:1'],
            'declining_rate'     => ['nullable', 'numeric', 'min:0.01', 'max:100'],
            'total_units'        => ['nullable', 'integer', 'min:1'],
            'units_used'         => ['nullable', 'integer', 'min:0'],
            'depreciation_start' => ['required', 'date'],
        ]);
        \App\Models\AssetDepreciation::create($validated);
        return back()->with('success', 'Depreciation schedule added.');
    })->name('depreciation.store');

    Route::patch('/depreciation/{id}', function (Request $request, $id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        $dep = \App\Models\AssetDepreciation::findOrFail($id);
        $dep->update($request->validate([
            'units_used' => ['nullable', 'integer', 'min:0'],
            'declining_rate' => ['nullable', 'numeric', 'min:0.01', 'max:100'],
            'useful_life_years' => ['nullable', 'integer', 'min:1'],
            'salvage_value' => ['nullable', 'numeric', 'min:0'],
        ]));
        return back()->with('success', 'Updated.');
    })->name('depreciation.update');

    Route::delete('/depreciation/{id}', function ($id) {
        if (Auth::user()->role !== 'admin') return redirect('/depreciation');
        \App\Models\AssetDepreciation::findOrFail($id)->delete();
        return back()->with('success', 'Depreciation schedule removed.');
    })->name('depreciation.destroy');

    /* ------------------------------------------------------------------ */
    /* MAINTENANCE LOGS                                                     */
    /* ------------------------------------------------------------------ */
    Route::post('/assets/{id}/maintenance', function (Request $request, $id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/assets');
        $asset = \App\Models\Asset::findOrFail($id);
        $validated = $request->validate([
            'type'             => ['required', 'in:service,repair,inspection,upgrade,other'],
            'maintenance_date' => ['required', 'date'],
            'next_due'         => ['nullable', 'date'],
            'technician'       => ['nullable', 'string', 'max:255'],
            'cost'             => ['nullable', 'numeric'],
            'notes'            => ['nullable', 'string'],
        ]);
        \App\Models\MaintenanceLog::create([...$validated, 'asset_id' => $asset->id, 'logged_by' => Auth::id()]);
        if ($validated['type'] === 'repair' && $asset->status === 'available') {
            $asset->update(['status' => 'in-repair']);
        }
        return back()->with('success', 'Maintenance log added.');
    })->name('maintenance.store');

    Route::delete('/maintenance/{id}', function ($id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/assets');
        \App\Models\MaintenanceLog::findOrFail($id)->delete();
        return back()->with('success', 'Log deleted.');
    })->name('maintenance.destroy');

    /* ------------------------------------------------------------------ */
    /* ASSET REQUESTS                                                       */
    /* ------------------------------------------------------------------ */
    Route::get('/requests', function () {
        $user = Auth::user();
        $requests = in_array($user->role, ['admin', 'manager'])
            ? \App\Models\AssetRequest::with(['asset', 'user', 'reviewer'])->latest()->get()
            : \App\Models\AssetRequest::with(['asset', 'reviewer'])->where('user_id', $user->id)->latest()->get();
        $availableAssets = \App\Models\Asset::where('status', 'available')->orderBy('name')->get(['id', 'name', 'asset_number', 'type']);
        return inertia('requests/index', compact('requests', 'availableAssets'));
    })->name('requests.index');

    Route::post('/requests', function (Request $request) {
        $validated = $request->validate(['asset_id' => ['required', 'exists:assets,id'], 'reason' => ['nullable', 'string', 'max:1000']]);
        $exists = \App\Models\AssetRequest::where('user_id', Auth::id())->where('asset_id', $validated['asset_id'])->where('status', 'pending')->exists();
        if ($exists) return back()->withErrors(['asset_id' => 'You already have a pending request for this asset.']);
        \App\Models\AssetRequest::create([...$validated, 'user_id' => Auth::id(), 'status' => 'pending']);
        return back()->with('success', 'Request submitted.');
    })->name('requests.store');

    Route::patch('/requests/{id}/approve', function ($id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/requests');
        $req = \App\Models\AssetRequest::with(['asset', 'user'])->findOrFail($id);
        if ($req->status !== 'pending') return redirect()->route('profile.edit');
        $req->asset->update(['status' => 'assigned', 'user_id' => $req->user_id]);
        $req->update(['status' => 'approved', 'reviewed_by' => Auth::id(), 'reviewed_at' => now()]);
        \App\Models\AssetRequest::where('asset_id', $req->asset_id)->where('id', '!=', $req->id)->where('status', 'pending')
            ->update(['status' => 'rejected', 'rejection_reason' => 'Asset was assigned to another user.', 'reviewed_by' => Auth::id(), 'reviewed_at' => now()]);
        $req->user->notify(new \App\Notifications\AssetRequestReviewed($req));
        return back()->with('success', 'Request approved and asset assigned.');
    })->name('requests.approve');

    Route::patch('/requests/{id}/reject', function (Request $request, $id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/requests');
        $req = \App\Models\AssetRequest::with(['asset', 'user'])->findOrFail($id);
        if ($req->status !== 'pending') return back();
        $request->validate(['rejection_reason' => ['nullable', 'string', 'max:500']]);
        $req->update(['status' => 'rejected', 'rejection_reason' => $request->rejection_reason, 'reviewed_by' => Auth::id(), 'reviewed_at' => now()]);
        $req->user->notify(new \App\Notifications\AssetRequestReviewed($req));
        return back()->with('success', 'Request rejected.');
    })->name('requests.reject');

    /* ------------------------------------------------------------------ */
    /* TRANSFER WORKFLOWS                                                   */
    /* ------------------------------------------------------------------ */
    Route::get('/transfers', function () {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        $transfers = \App\Models\AssetTransfer::with(['asset', 'fromUser', 'toUser', 'requester', 'reviewer'])->latest()->get();
        $assets    = \App\Models\Asset::where('status', 'assigned')->with('user')->orderBy('name')->get(['id', 'name', 'asset_number', 'type', 'user_id']);
        $users     = User::where('is_enabled', true)->orderBy('name')->get(['id', 'name', 'email']);
        return inertia('transfers/index', compact('transfers', 'assets', 'users'));
    })->name('transfers.index');

    Route::post('/transfers', function (Request $request) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        $validated = $request->validate([
            'asset_id'   => ['required', 'exists:assets,id'],
            'to_user_id' => ['required', 'exists:users,id'],
            'reason'     => ['nullable', 'string', 'max:1000'],
        ]);
        $asset    = \App\Models\Asset::findOrFail($validated['asset_id']);
        $transfer = \App\Models\AssetTransfer::create([
            'asset_id'     => $asset->id,
            'from_user_id' => $asset->user_id,
            'to_user_id'   => $validated['to_user_id'],
            'requested_by' => Auth::id(),
            'reason'       => $validated['reason'] ?? null,
            'status'       => 'pending',
        ]);
        $transfer->load(['asset', 'fromUser', 'toUser', 'requester']);
        // Notify other admins/managers
        User::whereIn('role', ['admin', 'manager'])->where('id', '!=', Auth::id())
            ->each(fn($u) => $u->notify(new \App\Notifications\TransferRequested($transfer)));
        return back()->with('success', 'Transfer request submitted.');
    })->name('transfers.store');

    Route::patch('/transfers/{id}/approve', function ($id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/transfers');
        $transfer = \App\Models\AssetTransfer::with(['asset', 'fromUser', 'toUser', 'requester'])->findOrFail($id);
        if ($transfer->status !== 'pending') return back();
        $asset     = $transfer->asset;
        $oldUserId = $asset->user_id;
        // Reassign asset
        $asset->update(['user_id' => $transfer->to_user_id, 'status' => 'assigned']);
        // Sync devices
        $deviceType = \App\Models\Asset::assetTypeToDeviceType($asset->type, $asset->device_platform);
        if ($deviceType) {
            if ($oldUserId) \App\Models\Device::where('user_id', $oldUserId)->where('name', $asset->name)->delete();
            \App\Models\Device::firstOrCreate(
                ['user_id' => $transfer->to_user_id, 'name' => $asset->name],
                ['type' => $deviceType, 'identifier' => $asset->serial_number]
            );
        }
        \App\Models\AssetLog::create([
            'asset_id' => $asset->id, 'user_id' => Auth::id(), 'action' => 'transferred',
            'detail'   => 'Transferred from ' . ($transfer->fromUser?->name ?? 'unassigned') . ' to ' . $transfer->toUser->name . ' by ' . Auth::user()->name,
        ]);
        $transfer->update(['status' => 'approved', 'reviewed_by' => Auth::id(), 'reviewed_at' => now()]);
        $transfer->requester->notify(new \App\Notifications\AssetTransferReviewed($transfer));
        return back()->with('success', 'Transfer approved.');
    })->name('transfers.approve');

    Route::patch('/transfers/{id}/reject', function (Request $request, $id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/transfers');
        $transfer = \App\Models\AssetTransfer::with(['asset', 'toUser', 'requester'])->findOrFail($id);
        if ($transfer->status !== 'pending') return back();
        $request->validate(['rejection_reason' => ['nullable', 'string', 'max:500']]);
        $transfer->update(['status' => 'rejected', 'rejection_reason' => $request->rejection_reason, 'reviewed_by' => Auth::id(), 'reviewed_at' => now()]);
        $transfer->requester->notify(new \App\Notifications\AssetTransferReviewed($transfer));
        return back()->with('success', 'Transfer rejected.');
    })->name('transfers.reject');

    /* ------------------------------------------------------------------ */
    /* DOCUMENT UPLOADS                                                     */
    /* ------------------------------------------------------------------ */
    Route::post('/assets/{id}/documents', function (Request $request, $id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/assets');
        $request->validate([
            'document' => ['required', 'file', 'max:10240', 'mimes:pdf,doc,docx,xls,xlsx,png,jpg,jpeg'],
            'label'    => ['nullable', 'string', 'max:255'],
        ]);
        $asset = \App\Models\Asset::findOrFail($id);
        $file  = $request->file('document');
        $path  = $file->store('asset-documents/' . $id, 'private');
        \App\Models\AssetDocument::create([
            'asset_id'    => $asset->id,
            'uploaded_by' => Auth::id(),
            'label'       => $request->label ?? $file->getClientOriginalName(),
            'file_path'   => $path,
            'file_name'   => $file->getClientOriginalName(),
            'mime_type'   => $file->getMimeType(),
            'file_size'   => $file->getSize(),
        ]);
        \App\Models\AssetLog::create([
            'asset_id' => $asset->id, 'user_id' => Auth::id(), 'action' => 'document_uploaded',
            'detail'   => 'Document "' . ($request->label ?? $file->getClientOriginalName()) . '" uploaded by ' . Auth::user()->name,
        ]);
        return back()->with('success', 'Document uploaded.');
    })->name('assets.documents.store');

    Route::get('/assets/{assetId}/documents/{docId}/download', function ($assetId, $docId) {
        $doc = \App\Models\AssetDocument::where('asset_id', $assetId)->findOrFail($docId);
        abort_unless(\Illuminate\Support\Facades\Storage::disk('private')->exists($doc->file_path), 404);
        return \Illuminate\Support\Facades\Storage::disk('private')->download($doc->file_path, $doc->file_name);
    })->name('assets.documents.download');

    Route::delete('/assets/{assetId}/documents/{docId}', function ($assetId, $docId) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/assets');
        $doc = \App\Models\AssetDocument::where('asset_id', $assetId)->findOrFail($docId);
        \Illuminate\Support\Facades\Storage::disk('private')->delete($doc->file_path);
        $doc->delete();
        return back()->with('success', 'Document deleted.');
    })->name('assets.documents.destroy');

    /* ------------------------------------------------------------------ */
    /* COMPLIANCE REPORTS (CSV exports)                                    */
    /* ------------------------------------------------------------------ */
    Route::get('/reports', function () {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        return inertia('reports/index');
    })->name('reports.index');

    Route::get('/reports/assets', function () {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        $assets = \App\Models\Asset::with('user')->orderBy('asset_number')->get();
        $rows   = collect([['Asset Number', 'Name', 'Type', 'Serial Number', 'Vendor', 'Department', 'Location', 'Status', 'Assigned To', 'Purchase Price', 'Purchase Date', 'Warranty Expiry', 'Notes']]);
        foreach ($assets as $a) {
            $rows->push([$a->asset_number, $a->name, $a->type, $a->serial_number ?? '', $a->vendor ?? '', $a->department ?? '', $a->location ?? '', $a->status, $a->user?->name ?? '', $a->purchase_price ?? '', $a->purchase_date ?? '', $a->warranty_expiry ?? '', $a->notes ?? '']);
        }
        $csv = $rows->map(fn($r) => implode(',', array_map(fn($v) => '"' . str_replace('"', '""', $v) . '"', $r)))->implode("\n");
        return response($csv, 200, ['Content-Type' => 'text/csv', 'Content-Disposition' => 'attachment; filename="assets-' . now()->format('Y-m-d') . '.csv"']);
    })->name('reports.assets');

    Route::get('/reports/assigned', function () {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        $assets = \App\Models\Asset::with('user')->where('status', 'assigned')->orderBy('asset_number')->get();
        $rows   = collect([['Asset Number', 'Asset Name', 'Type', 'Serial Number', 'Assigned To', 'User Email', 'Department', 'Location']]);
        foreach ($assets as $a) {
            $rows->push([$a->asset_number, $a->name, $a->type, $a->serial_number ?? '', $a->user?->name ?? '', $a->user?->email ?? '', $a->department ?? '', $a->location ?? '']);
        }
        $csv = $rows->map(fn($r) => implode(',', array_map(fn($v) => '"' . str_replace('"', '""', $v) . '"', $r)))->implode("\n");
        return response($csv, 200, ['Content-Type' => 'text/csv', 'Content-Disposition' => 'attachment; filename="assigned-assets-' . now()->format('Y-m-d') . '.csv"']);
    })->name('reports.assigned');

    Route::get('/reports/warranty', function () {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        $assets = \App\Models\Asset::with('user')->whereNotNull('warranty_expiry')->orderBy('warranty_expiry')->get();
        $rows   = collect([['Asset Number', 'Name', 'Type', 'Serial Number', 'Assigned To', 'Warranty Expiry', 'Status']]);
        foreach ($assets as $a) {
            $rows->push([$a->asset_number, $a->name, $a->type, $a->serial_number ?? '', $a->user?->name ?? '', $a->warranty_expiry, $a->status]);
        }
        $csv = $rows->map(fn($r) => implode(',', array_map(fn($v) => '"' . str_replace('"', '""', $v) . '"', $r)))->implode("\n");
        return response($csv, 200, ['Content-Type' => 'text/csv', 'Content-Disposition' => 'attachment; filename="warranty-report-' . now()->format('Y-m-d') . '.csv"']);
    })->name('reports.warranty');

    Route::get('/reports/audit', function () {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        $logs = \App\Models\AssetLog::with(['asset', 'user'])->latest()->get();
        $rows = collect([['Date', 'Asset Number', 'Asset Name', 'Action', 'Performed By', 'Detail']]);
        foreach ($logs as $l) {
            $rows->push([$l->created_at->format('Y-m-d H:i'), $l->asset?->asset_number ?? '', $l->asset?->name ?? '', $l->action, $l->user?->name ?? '', $l->detail ?? '']);
        }
        $csv = $rows->map(fn($r) => implode(',', array_map(fn($v) => '"' . str_replace('"', '""', $v) . '"', $r)))->implode("\n");
        return response($csv, 200, ['Content-Type' => 'text/csv', 'Content-Disposition' => 'attachment; filename="audit-log-' . now()->format('Y-m-d') . '.csv"']);
    })->name('reports.audit');

    /* ------------------------------------------------------------------ */
    /* PROFILE                                                              */
    /* ------------------------------------------------------------------ */
    Route::get('/profile', function () {
        $user   = Auth::user();
        $assets = \App\Models\Asset::where('user_id', $user->id)->get();
        return inertia('settings/profile', ['assignedAssets' => $assets]);
    })->name('profile.edit');

    Route::patch('/profile', function (Request $request) {
        $user = Auth::user();
        $user->update($request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]));
        return back();
    })->name('profile.update');

    /* NOTIFICATION PREFERENCES */
    Route::get('/profile/notifications', function () {
        $user = Auth::user();
        return inertia('settings/notifications', [
            'preferences' => $user->notification_preferences ?? [
                'asset_assigned'       => true,
                'warranty_expiry'      => true,
                'request_reviewed'     => true,
                'transfer_reviewed'    => true,
            ],
        ]);
    })->name('profile.notifications');

    Route::patch('/profile/notifications', function (Request $request) {
        $user = Auth::user();
        $validated = $request->validate([
            'asset_assigned'    => ['boolean'],
            'warranty_expiry'   => ['boolean'],
            'request_reviewed'  => ['boolean'],
            'transfer_reviewed' => ['boolean'],
        ]);
        $user->update(['notification_preferences' => $validated]);
        return back()->with('success', 'Notification preferences updated.');
    })->name('profile.notifications.update');

    /* ------------------------------------------------------------------ */
    /* USERS                                                                */
    /* ------------------------------------------------------------------ */
    Route::get('/users', function () {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/dashboard');
        return inertia('users/index', ['users' => ['data' => User::with('devices')->orderBy('created_at', 'desc')->get()]]);
    })->name('users.index');

    Route::get('/users/create', function () {
        if (Auth::user()->role !== 'admin') return redirect('/users');
        return inertia('users/create');
    })->name('users.create');

    Route::get('/users/{id}/edit', function ($id) {
        $authUser = Auth::user();
        if (!in_array($authUser->role, ['admin', 'manager']) && $authUser->id != $id) return redirect('/dashboard');
        $user            = User::findOrFail($id);
        $devices         = \App\Models\Device::where('user_id', $id)->latest()->get();
        $assets          = \App\Models\Asset::where('user_id', $id)->latest()->get();
        $availableAssets = \App\Models\Asset::where('status', 'available')->orderBy('name')->get(['id', 'name', 'asset_number', 'type', 'device_platform']);
        return inertia('users/edit', compact('user', 'devices', 'assets', 'availableAssets'));
    })->name('users.edit');

    Route::put('/users/{id}', function (Request $request, $id) {
        $authUser = Auth::user();
        if (!in_array($authUser->role, ['admin', 'manager']) && $authUser->id != $id) return redirect('/dashboard');
        $rules = [
            'name'       => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email', 'max:255', 'unique:users,email,' . $id],
            'is_enabled' => ['boolean'],
        ];
        if ($authUser->role === 'admin') $rules['role'] = ['nullable', 'string', 'in:admin,manager,user,employee'];
        $validated = $request->validate($rules);
        $validated['is_enabled'] = $request->boolean('is_enabled', true);
        User::findOrFail($id)->update($validated);
        return redirect('/users')->with('success', 'User updated successfully.');
    })->name('users.update');

    Route::post('/users/{id}/assign-asset', function (Request $request, $id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/users');
        $validated = $request->validate(['asset_id' => ['required', 'exists:assets,id']]);
        $asset     = \App\Models\Asset::findOrFail($validated['asset_id']);
        if ($asset->status !== 'available' || $asset->user_id !== null) {
            return back()->withErrors(['asset_id' => 'This asset is no longer available.']);
        }
        $asset->update(['user_id' => $id, 'status' => 'assigned']);
        $deviceType = \App\Models\Asset::assetTypeToDeviceType($asset->type, $asset->device_platform);
        if ($deviceType) {
            \App\Models\Device::firstOrCreate(['user_id' => $id, 'name' => $asset->name], ['type' => $deviceType, 'identifier' => $asset->serial_number]);
        }
        \App\Models\AssetLog::create(['asset_id' => $asset->id, 'user_id' => Auth::id(), 'action' => 'assigned', 'detail' => 'Assigned to user #' . $id . ' by ' . Auth::user()->name]);
        User::find($id)?->notify(new \App\Notifications\AssetAssigned($asset, Auth::user()->name));
        return back()->with('success', 'Asset assigned.');
    })->name('users.assign-asset');

    Route::delete('/users/{id}', function ($id) {
        if (Auth::user()->role !== 'admin') return redirect('/users');
        User::findOrFail($id)->delete();
        return redirect('/users')->with('success', 'User deleted.');
    })->name('users.destroy');

    /* ------------------------------------------------------------------ */
    /* DEVICES                                                              */
    /* ------------------------------------------------------------------ */
    Route::get('/devices', function (Request $request) {
        $type    = $request->query('type');
        $query   = \App\Models\Device::with('user')->latest();
        if ($type) $query->where('type', $type);
        return inertia('devices/index', ['devices' => $query->get(), 'type' => $type]);
    })->name('devices.index');

    Route::post('/devices', function (Request $request) {
        \App\Models\Device::create($request->validate([
            'user_id'    => ['required', 'exists:users,id'],
            'name'       => ['required', 'string', 'max:255'],
            'type'       => ['required', 'in:mac,ios,android,windows'],
            'identifier' => ['nullable', 'string', 'max:255'],
        ]));
        return back()->with('success', 'Device added.');
    })->name('devices.store');

    Route::delete('/devices/{id}', function ($id) {
        \App\Models\Device::findOrFail($id)->delete();
        return back()->with('success', 'Device removed.');
    })->name('devices.destroy');

    /* ------------------------------------------------------------------ */
    /* ASSETS                                                               */
    /* ------------------------------------------------------------------ */
    Route::get('/assets', function (Request $request) {
        $status = $request->query('status');
        $query  = \App\Models\Asset::with('user')->latest();
        if ($status) $query->where('status', $status);
        return inertia('assets/index', ['assets' => $query->get(), 'status' => $status]);
    })->name('assets.index');

    Route::get('/assets/create', function () {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/assets');
        return inertia('assets/create', ['users' => User::orderBy('name')->get(['id', 'name', 'email'])]);
    })->name('assets.create');

    Route::post('/assets', function (Request $request) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/assets');
        $validated = $request->validate([
            'asset_number'   => ['required', 'string', 'unique:assets,asset_number'],
            'name'           => ['required', 'string', 'max:255'],
            'type'           => ['required', 'string', 'max:100'],
            'serial_number'  => ['nullable', 'string', 'max:255'],
            'vendor'         => ['nullable', 'string', 'max:255'],
            'department'     => ['nullable', 'string', 'max:255'],
            'location'       => ['nullable', 'string', 'max:255'],
            'purchase_price' => ['nullable', 'numeric'],
            'purchase_date'  => ['nullable', 'date'],
            'warranty_expiry'=> ['nullable', 'date'],
            'status'         => ['required', 'in:available,assigned,in-repair,retired'],
            'notes'          => ['nullable', 'string'],
            'user_id'        => ['nullable', 'exists:users,id'],
        ]);
        if ($validated['user_id']) $validated['status'] = 'assigned';
        $asset = \App\Models\Asset::create($validated);
        \App\Models\AssetLog::create(['asset_id' => $asset->id, 'user_id' => Auth::id(), 'action' => 'created', 'detail' => 'Asset created by ' . Auth::user()->name]);
        $deviceType = \App\Models\Asset::assetTypeToDeviceType($asset->type, $asset->device_platform);
        if ($deviceType && $asset->user_id) {
            \App\Models\Device::firstOrCreate(['user_id' => $asset->user_id, 'name' => $asset->name], ['type' => $deviceType, 'identifier' => $asset->serial_number]);
        }
        if ($asset->user_id) {
            User::find($asset->user_id)?->notify(new \App\Notifications\AssetAssigned($asset, Auth::user()->name));
        }
        return redirect('/assets')->with('success', 'Asset created.');
    })->name('assets.store');

    Route::get('/assets/{id}/edit', function ($id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/assets');
        $asset = \App\Models\Asset::findOrFail($id);
        return inertia('assets/edit', [
            'asset'           => $asset,
            'users'           => User::orderBy('name')->get(['id', 'name', 'email']),
            'logs'            => \App\Models\AssetLog::with('user')->where('asset_id', $id)->latest()->get(),
            'maintenanceLogs' => \App\Models\MaintenanceLog::with('logger')->where('asset_id', $id)->latest()->get(),
            'documents'       => \App\Models\AssetDocument::with('uploader')->where('asset_id', $id)->latest()->get(),
        ]);
    })->name('assets.edit');

    Route::put('/assets/{id}', function (Request $request, $id) {
        if (!in_array(Auth::user()->role, ['admin', 'manager'])) return redirect('/assets');
        $asset     = \App\Models\Asset::findOrFail($id);
        $validated = $request->validate([
            'asset_number'    => ['required', 'string', 'unique:assets,asset_number,' . $id],
            'name'            => ['required', 'string', 'max:255'],
            'type'            => ['required', 'string', 'max:100'],
            'device_platform' => ['nullable', 'string', 'in:mac,ios,android,windows'],
            'serial_number'   => ['nullable', 'string', 'max:255'],
            'vendor'          => ['nullable', 'string', 'max:255'],
            'department'      => ['nullable', 'string', 'max:255'],
            'location'        => ['nullable', 'string', 'max:255'],
            'purchase_price'  => ['nullable', 'numeric'],
            'purchase_date'   => ['nullable', 'date'],
            'warranty_expiry' => ['nullable', 'date'],
            'status'          => ['required', 'in:available,assigned,in-repair,retired'],
            'notes'           => ['nullable', 'string'],
            'user_id'         => ['nullable', 'exists:users,id'],
        ]);
        $oldUserId = $asset->user_id;
        $newUserId = $validated['user_id'] ? (int)$validated['user_id'] : null;
        if ($newUserId) $validated['status'] = 'assigned';
        elseif (!$newUserId && $oldUserId) $validated['status'] = 'available';
        $asset->update($validated);
        if ($newUserId && $newUserId !== $oldUserId) {
            $assignedUser = User::find($newUserId);
            \App\Models\AssetLog::create(['asset_id' => $asset->id, 'user_id' => Auth::id(), 'action' => 'assigned', 'detail' => 'Assigned to ' . ($assignedUser?->name ?? 'unknown') . ' by ' . Auth::user()->name]);
            $assignedUser?->notify(new \App\Notifications\AssetAssigned($asset, Auth::user()->name));
        } elseif (!$newUserId && $oldUserId) {
            \App\Models\AssetLog::create(['asset_id' => $asset->id, 'user_id' => Auth::id(), 'action' => 'unassigned', 'detail' => 'Unassigned by ' . Auth::user()->name]);
        } else {
            \App\Models\AssetLog::create(['asset_id' => $asset->id, 'user_id' => Auth::id(), 'action' => 'updated', 'detail' => 'Updated by ' . Auth::user()->name]);
        }
        $deviceType = \App\Models\Asset::assetTypeToDeviceType($asset->type, $asset->device_platform);
        if ($deviceType && $newUserId) {
            \App\Models\Device::firstOrCreate(['user_id' => $newUserId, 'name' => $asset->name], ['type' => $deviceType, 'identifier' => $asset->serial_number]);
        } elseif ($deviceType && !$newUserId && $oldUserId) {
            \App\Models\Device::where('user_id', $oldUserId)->where('name', $asset->name)->delete();
        }
        return redirect('/assets')->with('success', 'Asset updated.');
    })->name('assets.update');

    Route::delete('/assets/{id}', function ($id) {
        if (Auth::user()->role !== 'admin') return redirect('/assets');
        $asset = \App\Models\Asset::findOrFail($id);
        \App\Models\AssetLog::create(['asset_id' => $asset->id, 'user_id' => Auth::id(), 'action' => 'deleted', 'detail' => 'Asset ' . $asset->asset_number . ' deleted by ' . Auth::user()->name]);
        $asset->delete();
        return redirect('/assets')->with('success', 'Asset deleted.');
    })->name('assets.destroy');

}); // end auth middleware group