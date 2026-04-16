@extends('layouts.app')

@section('content')

<h2>Dashboard</h2>

<p>Welcome, {{ Auth::user()->name }} 👋</p>

@endsection