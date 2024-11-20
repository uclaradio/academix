// page.tsx under /dashboard

"use client"; // Ensures this component runs as a client component in Next.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';


// Define the Artist interface and other types
interface Artist {
  id: string;
  name: string;
  genres: string[];
}

type Major = 
  | "Aerospace Engineering"
  | "African American Studies"
  | "American Indian Studies"
  | "Anthropology"
  | "Archaeology"
  | "Architecture"
  | "Art"
  | "Art History"
  | "Asian American Studies"
  | "Chemistry and Biochemistry"
  | "Chicana/o and Central American Studies"
  | "Civil Engineering"
  | "Classics"
  | "Communications"
  | "Comparative Literature"
  | "Computational and Systems Biology"
  | "Computer Science"
  | "Conservation of Archaeological & Ethnographic Materials"
  | "Dance"
  | "DESMA"
  | "Ecology and Evolutionary Biology"
  | "Economics"
  | "Electrical Engineering"
  | "English"
  | "Ethnomusicology"
  | "Film and Television"
  | "Geography"
  | "History"
  | "LGBTQ Studies"
  | "Linguistics"
  | "Mathematics"
  | "Mechanical Engineering"
  | "Microbiology, Immunology, and Molecular Genetics"
  | "Molecular, Cell, and Developmental Biology"
  | "Musicology"
  | "Neuroscience"
  | "Philosophy"
  | "Physics"
  | "Political Science"
  | "Psychology"
  | "Public Affairs"
  | "Public Health"
  | "Society and Genetics"
  | "Sociology"
  | "Statistics and Data Science"
  | "Theater"
  | "World Arts and Cultures"
  | "Undecided";

const majorGenreMap: Record<Major, string[]> = {
  // Add the genre mappings here
  "Aerospace Engineering": ["electronic", "synthwave", "rock"],
  "African American Studies": ["hip-hop", "jazz", "blues"],
  "American Indian Studies": ["folk", "indigenous", "world"],
  "Anthropology": ["world", "folk", "indie"],
  "Archaeology": ["classical", "folk", "instrumental"],
  "Architecture": ["ambient", "electronic", "classical"],
  "Art": ["alternative", "indie", "psychedelic"],
  "Art History": ["classical", "jazz", "ambient"],
  "Asian American Studies": ["pop", "k-pop", "jazz"],
  "Chemistry and Biochemistry": ["electronic", "classical", "rock"],
  "Chicana/o and Central American Studies": ["latin", "reggaeton", "cumbia"],
  "Civil Engineering": ["rock", "electronic", "industrial"],
  "Classics": ["classical", "opera", "choral"],
  "Communications": ["pop", "hip-hop", "electronic"],
  "Comparative Literature": ["folk", "jazz", "indie"],
  "Computational and Systems Biology": ["electronic", "ambient", "instrumental"],
  "Computer Science": ["electronic", "chiptune", "lo-fi"],
  "Conservation of Archaeological & Ethnographic Materials": ["classical", "world", "ambient"],
  "Dance": ["dance", "pop", "electronic"],
  "DESMA": ["experimental", "electronic", "ambient"],
  "Ecology and Evolutionary Biology": ["folk", "indie", "nature sounds"],
  "Economics": ["jazz", "pop", "rock"],
  "Electrical Engineering": ["electronic", "synthwave", "techno"],
  "English": ["indie", "folk", "alternative"],
  "Ethnomusicology": ["world", "jazz", "folk"],
  "Film and Television": ["soundtrack", "pop", "classical"],
  "Geography": ["world", "ambient", "indie"],
  "History": ["classical", "jazz", "folk"],
  "LGBTQ Studies": ["pop", "dance", "alternative"],
  "Linguistics": ["world", "classical", "ambient"],
  "Mathematics": ["classical", "ambient", "electronic"],
  "Mechanical Engineering": ["rock", "electronic", "industrial"],
  "Microbiology, Immunology, and Molecular Genetics": ["instrumental", "electronic", "ambient"],
  "Molecular, Cell, and Developmental Biology": ["classical", "instrumental", "ambient"],
  "Musicology": ["classical", "jazz", "folk"],
  "Neuroscience": ["ambient", "instrumental", "electronic"],
  "Philosophy": ["classical", "jazz", "folk"],
  "Physics": ["electronic", "classical", "synthwave"],
  "Political Science": ["folk", "pop", "rock"],
  "Psychology": ["alternative", "pop", "ambient"],
  "Public Affairs": ["pop", "jazz", "hip-hop"],
  "Public Health": ["world", "pop", "jazz"],
  "Society and Genetics": ["ambient", "indie", "folk"],
  "Sociology": ["pop", "hip-hop", "alternative"],
  "Statistics and Data Science": ["electronic", "lo-fi", "instrumental"],
  "Theater": ["musical theater", "pop", "jazz"],
  "World Arts and Cultures": ["world", "folk", "pop"],
  "Undecided": ["pop", "alternative", "indie"]
};

// Guess the user's major based on their top genres
function guessMajor(topArtists: Artist[]): Major {
  const genreCounts: { [key: string]: number } = {};

  // Count the genres in the user's top artists
  topArtists.forEach(artist => {
    artist.genres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  // Calculate scores for each major
  const majorScores: { [key in Major]: number } = {} as { [key in Major]: number };
  for (const major in majorGenreMap) {
    majorScores[major as Major] = majorGenreMap[major as Major].reduce((score, genre) => {
      return score + (genreCounts[genre] || 0);
    }, 0);
  }

  // Determine the best matching major
  const guessedMajor = Object.keys(majorScores).reduce((a, b) => majorScores[a as Major] > majorScores[b as Major] ? a : b) as Major;
  
  return guessedMajor;
}

// Main Dashboard component
const Dashboard: React.FC = () => {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [guessedMajor, setGuessedMajor] = useState<Major | "">("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      // Fetch the top artists from your backend
      axios.get(`http://localhost:3001/top-music?access_token=${accessToken}`)
        .then(response => {
          const artists: Artist[] = response.data.items;
          setTopArtists(artists);

          // Guess the major based on top artists
          const major = guessMajor(artists);
          setGuessedMajor(major);
        })
        .catch(error => {
          console.error("Error fetching top artists:", error);
        });
    }
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.heading}>Your Dashboard</h1>
      <h2 className={styles.subheading}>Discover what your music taste reveals about you!</h2>
      <div className={styles.guessedMajor}>
        Guessed Major: {guessedMajor || "Loading..."}
      </div>
      <ul className={styles.artistList}>
        {topArtists.map(artist => (
          <li key={artist.id} className={styles.artistListItem}>
            <span className={styles.artistName}>{artist.name}</span>
            <span className={styles.artistGenres}>
              Genres: {artist.genres.join(", ")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
