@extends('layouts.app')

@section('content')

<div style="max-width:1100px; margin:0 auto;">

    <!-- TITLE -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="margin:0;">Users</h2>

        <a href="/users/create" style="
            padding:10px 18px;
            background:#6366f1;
            color:white;
            border-radius:8px;
            text-decoration:none;
            font-weight:500;
        ">
            + Add User
        </a>
    </div>

    <!-- TABLE CARD -->
    <div style="
    background:white;
    padding:20px;
    border-radius:12px;
    width:100%;
    max-width:1000px;
    margin-top:20px;
    box-shadow:0 4px 10px rgba(0,0,0,0.05);
    ">

        <table style="width:100%; border-collapse:collapse;">

            <!-- HEADER -->
            <tr style="background:#f1f5f9;">
                <th style="padding:15px; text-align:left;">Name</th>
                <th style="padding:15px; text-align:left;">Email</th>
                <th style="padding:15px; text-align:right;">Actions</th>
            </tr>

            @foreach($users as $user)
            <tr style="border-bottom:1px solid #e5e7eb;">

                <td style="padding:15px;">
                    {{ $user->name }}
                </td>

                <td style="padding:15px;">
                    {{ $user->email }}
                </td>

                <!-- ACTIONS (RIGHT ALIGNED CLEANLY) -->
                <td style="padding:15px; text-align:right;">

                    <a href="/users/{{ $user->id }}/edit" style="
                        color:#2563eb;
                        text-decoration:none;
                        font-weight:500;
                        margin-right:15px;
                    ">
                        Edit
                    </a>

                    <form method="POST" action="/users/{{ $user->id }}" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button style="
                            color:#ef4444;
                            border:none;
                            background:none;
                            cursor:pointer;
                            font-weight:500;
                        ">
                            Delete
                        </button>
                    </form>

                </td>

            </tr>
            @endforeach

        </table>

    </div>

</div>

@endsection