"use client"; // client component
import styles from './LoginPage.module.css'; // Import the CSS module

export default function LoginPage() {
  const handleLogin = () => {
    console.log("Redirecting to backend login"); // Debugging log
    window.location.href = 'http://localhost:3001/login'; // Redirect to backend /login route
  };

  return (
    <div className={styles.loginPage}>
      {/* Background Pattern */}
      <div className={styles.background}></div>
      
      {/* Content Container */}
      <div className={styles.container}>
        <h1 className={styles.heading}>Welcome to Guess Your Major!</h1>
        <p className={styles.description}>
          Find out what your music taste says about you. Log in with Spotify to get started!
        </p>
        <button onClick={handleLogin} className={styles.loginButton}>
          Log in with Spotify
        </button>
      </div>
    </div>
  );
}
