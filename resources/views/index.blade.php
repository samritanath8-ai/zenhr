@extends('layouts.app')

@section('content')

<div class="card">

    <h2>Users</h2>

    <!-- ADD USER -->
    <form method="POST" action="/users">
        @csrf
        <input type="text" name="name" placeholder="Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <button>Add User</button>
    </form>

    <table>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
        </tr>

        @foreach($users as $user)
        <tr>
            <td>
                <a class="link" href="/users/{{ $user->id }}">
                    {{ $user->name }}
                </a>
            </td>

            <td>{{ $user->email }}</td>

            <td>
                <a href="/users/{{ $user->id }}/edit">Edit</a>

                <form method="POST" action="/users/{{ $user->id }}" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button>Delete</button>
                </form>
            </td>
        </tr>
        @endforeach
    </table>

</div>

@endsection