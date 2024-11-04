"use client"; // client component

export default function LoginPage() {
  const handleLogin = () => {
    console.log("Redirecting to backend login"); // Debugging log
    window.location.href = 'http://localhost:3001/login'; // Redirect to backend /login route
  };

  return (
    <div className="login-page">
      <h1>Welcome to Guess Your Major!</h1>
      <button onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
}