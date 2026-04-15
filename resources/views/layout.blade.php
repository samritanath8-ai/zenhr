<!DOCTYPE html>
<html>
<head>
    <title>HRM</title>
    <style>
        body {
            font-family: Arial;
            margin: 0;
            background: #f5f6fa;
        }

        .navbar {
            background: #2f3640;
            padding: 15px;
            color: white;
            display: flex;
            justify-content: space-between;
        }

        .navbar a {
            color: white;
            margin-right: 15px;
            text-decoration: none;
        }

        .container {
            padding: 20px;
        }

        .card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .btn {
            padding: 8px 15px;
            background: #0984e3;
            color: white;
            border: none;
            border-radius: 5px;
            text-decoration: none;
        }
    </style>
</head>
<body>

<div class="navbar">
    <div>
        <a href="/dashboard">Dashboard</a>
        <a href="/users">Users</a>
    </div>
    <div>
        {{ session('user') }} |
        <a href="/logout">Logout</a>
    </div>
</div>

<div class="container">
    @yield('content')
</div>

</body>
</html>