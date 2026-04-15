@extends('layout')

@section('content')

<div class="card">
    <h2>Welcome {{ session('user') }} 👋</h2>
    <p>This is your dashboard.</p>
</div>

@endsection