<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Models\User;

/* HOME */
Route::get('/', fn() => redirect('/login'));

/* LOGIN */
Route::get('/login', fn() => inertia('auth/login'))->name('login');
Route::post('/login', function (Request $request) {
    $request->validate([
        'email'    => ['required', 'email'],
        'password' => ['required'],
    ]);
    if (Auth::attempt($request->only('email', 'password'))) {
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
    $user = User::create([
        'name'     => $validated['name'],
        'email'    => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);
    Auth::login($user);
    return redirect('/dashboard');
})->name('register.store');

/* LOGOUT */
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/login');
})->name('logout');

/* DASHBOARD */
Route::get('/dashboard', function () {
    return inertia('dashboard', [
        'totalUsers' => \App\Models\User::count(),
    ]);
})->middleware('auth')->name('dashboard');

/* AUTHENTICATED ROUTES */
Route::middleware('auth')->group(function () {

    /* PROFILE */
    Route::get('/profile', fn() => inertia('settings/profile'))->name('profile.edit');
    Route::patch('/profile', function (Request $request) {
        $user = Auth::user();
        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);
        $user->update($validated);
        return back();
    })->name('profile.update');

    /* USERS */
    Route::get('/users', function () {
        $users = User::orderBy('created_at', 'desc')->paginate(20);
        return inertia('users/index', compact('users'));
    })->name('users.index');

    Route::get('/users/create', fn() => inertia('users/create'))->name('users.create');

    Route::post('/users', function (Request $request) {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);
        User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        return redirect('/users')->with('success', 'User created successfully.');
    })->name('users.store');

    Route::get('/users/{id}/edit', function ($id) {
        $user = User::findOrFail($id);
        return inertia('users/edit', compact('user'));
    })->name('users.edit');

    Route::put('/users/{id}', function (Request $request, $id) {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $id],
        ]);
        $user->update($validated);
        return redirect('/users')->with('success', 'User updated successfully.');
    })->name('users.update');

    Route::delete('/users/{id}', function ($id) {
        User::findOrFail($id)->delete();
        return redirect('/users')->with('success', 'User deleted.');
    })->name('users.destroy');
});