@extends('layouts.app')

@section('content')
<h2>Edit Profile</h2>

<form method="POST">
    @csrf

    <input type="text" name="name" value="{{ Auth::user()->name }}"><br><br>
    <input type="email" name="email" value="{{ Auth::user()->email }}"><br><br>

    <button type="submit">Update</button>
</form>
@endsection