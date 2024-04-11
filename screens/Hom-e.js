import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";

function HomeScreen() {
  const [username, setUsername] = useState("");
  const [movieId, setMovieId] = useState("");
  const [rating, setRating] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/movies/${username}`);
      const data = await response.json();
      setMovies(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setIsLoading(false);
    }
  };

  const addMovie = async () => {
    try {
      const response = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, movieId, rating }),
      });
      if (response.ok) {
        console.log("Movie rating added successfully");
        setUsername("");
        setMovieId("");
        setRating("");
        fetchMovies();
      } else {
        console.error("Failed to add movie rating");
      }
    } catch (error) {
      console.error("Error adding movie rating:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Movie Ratings</Text>
      <View style={{ marginTop: 500 }}>
        <Text>Add Movie Rating</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <TextInput
          placeholder="Movie ID"
          value={movieId}
          onChangeText={(text) => setMovieId(text)}
          style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <TextInput
          placeholder="Rating"
          value={rating}
          onChangeText={(text) => setRating(text)}
          style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <Button title="Add Rating" onPress={addMovie} />
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>My Movie Ratings</Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Movie ID:</Text>{" "}
                {item.movieId},{" "}
                <Text style={{ fontWeight: "bold" }}>Rating:</Text>{" "}
                {item.rating}
              </Text>
            )}
          />
        )}
      </View>
    </View>
  );
}

export default HomeScreen;
