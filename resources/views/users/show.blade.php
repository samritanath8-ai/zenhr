@extends('layouts.app')

@section('content')
    <h2>User Profile</h2>

    <p>Name: {{ $user->name }}</p>
    <p>Email: {{ $user->email }}</p>

    <a href="/users">Back</a>
@endsection