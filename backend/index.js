const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import cors
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Use CORS to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:3000', // Allow only the frontend origin
}));

// Middleware
app.use(express.json());

// Spotify Authentication Route
app.get('/login', (req, res) => {
  const scope = 'user-top-read';
  const redirectUri = encodeURIComponent(process.env.REDIRECT_URI);
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
  res.redirect(spotifyAuthUrl);
});

// Spotify Callback Route
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = response.data.access_token;
    res.redirect(`http://localhost:3000/dashboard?access_token=${accessToken}`);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('Authentication failed');
  }
});

// Fetching User Data from Spotify
app.get('/top-music', async (req, res) => {
  const { access_token } = req.query;
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    res.json(response.data);
  } catch (error) {
    res.status(400).send('Error fetching top artists');
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
