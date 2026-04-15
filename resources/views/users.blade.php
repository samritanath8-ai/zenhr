@extends('layout')

@section('content')

<div class="card">
    <h2>Users</h2>

    <a href="/users/create" class="btn">+ Add User</a>

    <table border="1" width="100%" style="margin-top:15px;">
        <tr>
            <th>Name</th>
            <th>Email</th>
        </tr>

        @foreach($users as $user)
        <tr>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
        </tr>
        @endforeach

    </table>
</div>

@endsection