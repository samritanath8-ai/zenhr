<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

/* HOME */
Route::get('/', function () {
    return redirect('/login');
});

/* LOGIN PAGE */
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

/* LOGIN POST */
Route::post('/login', function (Request $request) {
    if (Auth::attempt([
        'email' => $request->email,
        'password' => $request->password
    ])) {
        return redirect('/dashboard');
    }
    return back()->with('error', 'Invalid credentials');
});

/* LOGOUT */
Route::post('/logout', function () {
    Auth::logout();
    return redirect('/login');
});

/* DASHBOARD */
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth');

/* USERS LIST */
Route::get('/users', function () {
    $users = User::all();
    return view('users.index', compact('users'));
})->middleware('auth');

/* CREATE USER PAGE */
Route::get('/users/create', function () {
    return view('users.create');
})->middleware('auth');

/* STORE USER */
Route::post('/users', function (Request $request) {
    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);
    return redirect('/users');
})->middleware('auth');

/* DELETE USER */
Route::delete('/users/{id}', function ($id) {
    User::find($id)->delete();
    return redirect('/users');
})->middleware('auth');

/* EDIT USER PAGE */
Route::get('/users/{id}/edit', function ($id) {
    $user = User::findOrFail($id);
    return view('users.edit', compact('user'));
})->middleware('auth');

/*update route*/
Route::put('/users/{id}', function (Request $request, $id) {
    $user = User::findOrFail($id);

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
    ]);

    return redirect('/users');
})->middleware('auth');

/* PROFILE PAGE */
Route::get('/profile', function () {
    return view('profile');
})->middleware('auth');

/* UPDATE PROFILE */
Route::post('/profile', function (Request $request) {
    $user = Auth::user();

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
    ]);

    return back();
})->middleware('auth');

Route::get('/profile', function () {
    return view('profile');
})->middleware('auth');

Route::get('/profile/edit', function () {
    return view('profile_edit');
})->middleware('auth');

Route::post('/profile/edit', function (Illuminate\Http\Request $request) {
    $user = Illuminate\Support\Facades\Auth::user();
    $user->name = $request->name;
    $user->email = $request->email;
    $user->save();

    return redirect('/profile');
})->middleware('auth');