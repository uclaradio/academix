"use client"; // This is a client component

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      // Fetch data from your backend or directly from Spotify with the access token
      axios
        .get(`http://localhost:3001/top-music?access_token=${accessToken}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  return (
    <div>
      <h1>Your Dashboard</h1>
      {userData ? <pre>{JSON.stringify(userData, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}
