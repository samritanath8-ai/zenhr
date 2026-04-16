@extends('layouts.app')

@section('content')

<h2>Edit User</h2>

<form method="POST" action="/users/{{ $user->id }}">
    @csrf
    @method('PUT')

    <input type="text" name="name" value="{{ $user->name }}" required><br><br>
    <input type="email" name="email" value="{{ $user->email }}" required><br><br>

    <button type="submit">Update</button>
</form>

@endsection