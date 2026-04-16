@extends('layouts.app')

@section('content')

<h2>Add User</h2>

<form method="POST" action="/users">
@csrf

<input type="text" name="name" placeholder="Name"><br><br>
<input type="email" name="email" placeholder="Email"><br><br>
<input type="password" name="password" placeholder="Password"><br><br>

<button type="submit">Create</button>

</form>

@endsection