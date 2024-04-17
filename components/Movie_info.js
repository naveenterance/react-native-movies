import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";

const Movie_info = () => {
  const [movieData, setMovieData] = useState(null);
  const API_KEY = "e24ea998";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://www.omdbapi.com/?apikey=e24ea998&i=tt0079501&plot=full"
        );
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {movieData ? (
        <>
          <Image
            source={{ uri: movieData.Poster }}
            style={{ width: 200, height: 300 }}
          />
          <Text>Title: {movieData.Title}</Text>
          <Text>Year: {movieData.Year}</Text>
          <Text>Rated: {movieData.Rated}</Text>
          <Text>Released: {movieData.Released}</Text>
          <Text>Runtime: {movieData.Runtime}</Text>
          <Text>Genre: {movieData.Genre}</Text>
          <Text>Director: {movieData.Director}</Text>
          <Text>Writer: {movieData.Writer}</Text>
          <Text>Actors: {movieData.Actors}</Text>
          <Text>Plot: {movieData.Plot}</Text>
          <Text>Language: {movieData.Language}</Text>
          <Text>Country: {movieData.Country}</Text>
          <Text>Awards: {movieData.Awards}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Movie_info;
