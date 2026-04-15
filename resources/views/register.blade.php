<h2>Register</h2>

<form method="POST" action="/register">
    @csrf
    Name: <input type="text" name="name"><br>
    Email: <input type="email" name="email"><br>
    Password: <input type="password" name="password"><br>
    <button type="submit">Register</button>
</form>

<a href="/login">Already have an account? Login</a>