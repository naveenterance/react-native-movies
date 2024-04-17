import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { useQuery, gql, useMutation } from "@apollo/client";

const GET_ALL_USERS = gql`
  query {
    allUsers {
      id
      username
      movieId
      rating
      review
    }
  }
`;

const ADD_USER = gql`
  mutation CreateUser(
    $username: String!
    $movieId: String!
    $rating: String!
    $review: String!
  ) {
    create(
      username: $username
      movieId: $movieId
      rating: $rating
      review: $review
    ) {
      id
      username
      movieId
      rating
      review
    }
  }
`;

const Search = () => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [addUser] = useMutation(ADD_USER);
  console.log(data);

  const API_KEY = "e24ea998";
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [movieId, setMovieId] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (token) {
          const decoded = jwtDecode(token);
          setUsername(decoded.name);
        }
      } catch (error) {
        console.error("Error retrieving user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    searchMovies();
  }, []);

  const searchMovies = async () => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`
      );
      const data = await response.json();
      if (data.Search) {
        const moviesWithRatings = await Promise.all(
          data.Search.map(async (movie) => {
            const ratingResponse = await fetch(
              `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=full`
            );
            const ratingData = await ratingResponse.json();
            return {
              ...movie,
              rating: ratingData.Ratings.find(
                (rating) => rating.Source === "Rotten Tomatoes"
              ),
            };
          })
        );
        setMovies(moviesWithRatings);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (id) => {
    try {
      await addUser({
        variables: {
          username,
          movieId: id,
          rating,
          review,
        },
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const renderItem = ({ item }) => {
    const userRating =
      data && data.allUsers
        ? data.allUsers.find(
            (userMovie) =>
              userMovie.movieId === item.imdbID &&
              userMovie.username === username
          )?.rating
        : null;

    console.log(userRating);

    return (
      <View
        style={{
          margin: 8,
          backgroundColor: "#E5E7EB",
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Image
          style={{ height: 80, width: 80 }}
          source={{
            uri: `http://img.omdbapi.com/?apikey=${API_KEY}&i=${item.imdbID}`,
          }}
        />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text numberOfLines={1} style={{ color: "#4B5563" }}>
            {item.Title}{" "}
            <Text style={{ fontStyle: "italic", color: "#4B5563" }}>
              [{item.Year}]
            </Text>
          </Text>
          {item.rating ? (
            <View>
              <Text
                style={{ fontStyle: "italic", color: "#4B5563" }}
              >{`Critics: ${item.rating.Value}`}</Text>
              <View
                style={{
                  width: "100%",
                  backgroundColor: "#E5E7EB",
                  borderRadius: 999,
                  height: 4,
                }}
              >
                <View
                  style={{
                    width: item.rating.Value,
                    backgroundColor: "#ED8936",
                    alignItems: "center",
                    padding: 2,
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: "500",
                    color: "#4299E1",
                    textAlign: "center",
                    lineHeight: 10,
                  }}
                >
                  <Text></Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={{ fontStyle: "italic", color: "#4B5563" }}>
              [No critics ratings]
            </Text>
          )}
          {userRating ? (
            <View>
              <Text
                style={{ fontStyle: "italic", color: "#4B5563" }}
              >{`Your rating: ${parseFloat(userRating) + "%"}`}</Text>
              <View
                style={{
                  width: "100%",
                  backgroundColor: "#E5E7EB",
                  borderRadius: 999,
                  height: 4,
                }}
              >
                <View
                  style={{
                    width: parseFloat(userRating) + "%",
                    backgroundColor: "#4A5568",
                    alignItems: "center",
                    padding: 2,
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: "500",
                    color: "#4299E1",
                    textAlign: "center",
                    lineHeight: 12,
                  }}
                >
                  <Text></Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#4B5563",
                  padding: 2,
                  marginVertical: 4,
                  borderRadius: 8,
                }}
                placeholder="Enter your rating"
                onChangeText={setRating}
              />
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#4B5563",
                  padding: 2,
                  marginVertical: 4,
                  borderRadius: 8,
                }}
                placeholder="Enter your review"
                onChangeText={setReview}
              />
              <Button onPress={() => handleSubmit(item.imdbID)} title="Rate" />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginTop: "10%" }}>
      <TextInput
        style={{
          backgroundColor: "#E5E7EB",
          width: "75%",
          marginHorizontal: "12%",
          marginTop: 12,
          padding: 8,
          borderRadius: 999,
        }}
        placeholder="Search for movies..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={searchMovies}
      />
      <Pressable
        onPress={searchMovies}
        style={{ marginTop: 12, alignSelf: "center" }}
      >
        <FontAwesome name="search" size={36} color="black" />
      </Pressable>

      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.imdbID}
        style={{ marginBottom: 36 }}
      />

      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
    </View>
  );
};

export default Search;
