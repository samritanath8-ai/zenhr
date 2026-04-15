@extends('layouts.app')

@section('content')

<div class="card">
    <h2>{{ $user->name }}</h2>
    <p><b>Email:</b> {{ $user->email }}</p>

    <br>
    <a href="/users">← Back</a>
</div>

@endsection