import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Movie_info = ({ id }) => {
  const [movieData, setMovieData] = useState(null);
  const API_KEY = "e24ea998";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
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
    <View style={{ flex: 1 }}>
      {movieData ? (
        <ScrollView>
          <View>
            <Image
              source={{ uri: movieData.Poster }}
              style={{ width: "100%", height: 600 }}
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
            <Text style={{ width: 400 }}>Plot: {movieData.Plot}</Text>
            <Text>Language: {movieData.Language}</Text>
            <Text>Country: {movieData.Country}</Text>
            <Text style={{ width: 400 }}>Awards: {movieData.Awards}</Text>
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Movie_info;
