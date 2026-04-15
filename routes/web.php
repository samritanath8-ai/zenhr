use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

/* DASHBOARD */
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth');

/* USERS LIST */
Route::get('/users', function () {
    $users = User::all();
    return view('users.index', compact('users'));
})->middleware('auth');

/* ADD USER */
Route::post('/users', function (Request $request) {

    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt('123456')
    ]);

    return redirect('/users');
});

/* VIEW PROFILE */
Route::get('/users/{id}', function ($id) {
    $user = User::findOrFail($id);
    return view('users.show', compact('user'));
});

/* DELETE */
Route::delete('/users/{id}', function ($id) {
    User::find($id)->delete();
    return redirect('/users');
});