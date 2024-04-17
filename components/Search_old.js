import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode"; // Correct import statement
import { useQuery, gql } from "@apollo/client";
import "core-js/stable/atob";

const GET_ALL_USERS = gql`
  query {
    allUsers {
      id
      username
      movieId
      rating
    }
  }
`;

const Search = () => {
  const API_KEY = "e24ea998";
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (token) {
          const decoded = jwtDecode(token);
          setUser(decoded);
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

  const renderItem = ({ item }) => {
    const username = user ? user.name : ""; // Extract username
    const userRating = data.allUsers.find(
      (userMovie) =>
        userMovie.movieId === item.imdbID && userMovie.username === username
    )?.rating;

    // Handle NaN case
    const userRatingText = isNaN(parseFloat(userRating))
      ? "N/A"
      : `${parseFloat(userRating)}%`;

    return (
      <View
        style={{
          margin: 8,
          backgroundColor: "#E5E7EB",
          padding: 8,
          flexDirection: "row",
          borderRadius: 8,
        }}
      >
        <Image
          style={{ height: 80, width: 80 }}
          source={{
            uri: `http://img.omdbapi.com/?apikey=${API_KEY}&i=${item.imdbID}`,
          }}
        />
        <View className="w-3/4 px-4 ">
          <Text
            style={{
              color: "#4B5563",
              overflow: "hidden",
              numberOfLines: 1,
            }}
          >
            {item.Title}{" "}
            <Text
              style={{
                color: "#4B5563",
                fontStyle: "italic",
              }}
            >
              [{item.Year}]
            </Text>
          </Text>
          {item.rating ? (
            <View>
              <Text
                style={{
                  color: "#4B5563",
                  fontStyle: "italic",
                }}
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
            <Text
              style={{
                color: "#4B5563",
                fontStyle: "italic",
              }}
            >
              [No critics ratings]
            </Text>
          )}
          <View>
            <Text
              style={{
                color: "#4B5563",
                fontStyle: "italic",
              }}
            >{`Your rating: ${userRatingText}`}</Text>
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
                  width: isNaN(parseFloat(userRating))
                    ? "0%"
                    : `${parseFloat(userRating)}%`,
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
        </View>
      </View>
    );
  };

  return (
    <View>
      <TextInput
        style={{
          backgroundColor: "#E5E7EB",
          width: "75%",
          marginHorizontal: 16,
          marginTop: 48,
          padding: 8,
          borderRadius: 999,
        }}
        placeholder="Search for movies..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={searchMovies}
      />
      <Pressable onPress={searchMovies} className="mt-12">
        <FontAwesome name="search" size={36} color="black" />
      </Pressable>
      <Pressable
        className="mt-56"
        onPress={() => navigation.navigate("Profile")}
      >
        <Text>Profile</Text>
      </Pressable>
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.imdbID}
      />
    </View>
  );
};

export default Search;
