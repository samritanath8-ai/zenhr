@extends('layouts.app')

@section('content')

<h2 style="font-size:24px; margin-bottom:20px;">Users</h2>

<a href="/users/create" style="padding:10px 15px; background:#6b46c1; color:white; text-decoration:none; border-radius:6px;">
    + Add User
</a>

<br><br>

<table border="1" cellpadding="12" style="width:100%; border-collapse:collapse;">
<tr style="background:#f3f4f6;">
    <th>Name</th>
    <th>Email</th>
    <th>Actions</th>
</tr>

@foreach($users as $user)
<tr>
    <td>{{ $user->name }}</td>
    <td>{{ $user->email }}</td>
    <td>

        <a href="/users/{{ $user->id }}/edit" style="color:blue;">Edit</a>


        <form method="POST" action="/users/{{ $user->id }}" style="display:inline;">
            @csrf
            @method('DELETE')
            <button type="submit" style="color:red; border:none; background:none; cursor:pointer;">
                Delete
            </button>
        </form>

    </td>
</tr>
@endforeach

</table>

@endsection