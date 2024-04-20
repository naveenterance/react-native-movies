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
import Movie_info from "./Movie_info";

import { Platform, BackHandler } from "react-native";

import { GET_ALL_USERS } from "../utils/graphql";
import { ADD_USER } from "../utils/graphql";
import { useID } from "../utils/CurrentId";

import Toast from "react-native-simple-toast";

const Search = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const [addUser] = useMutation(ADD_USER);
  const { id, setId } = useID();

  const API_KEY = "e24ea998";
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [movieId, setMovieId] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (token) {
          const decoded = jwtDecode(token);
          setUsername(decoded.name);
          setUser(decoded.name);
        }
      } catch (error) {
        console.error("Error retrieving user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const searches = await AsyncStorage.getItem(`recentSearches_${user}`);
        if (searches) {
          setRecentSearches(JSON.parse(searches));
        }
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    };

    loadRecentSearches();
  }, [user]);

  const saveRecentSearches = async (query) => {
    try {
      const searches = recentSearches.filter(
        (search, index) => index < 5 && search !== query
      );
      const updatedSearches = [query, ...searches];
      await AsyncStorage.setItem(
        `recentSearches_${user}`, // Save recent searches with user ID
        JSON.stringify(updatedSearches)
      );
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };

  const handlepress = (m_id) => {
    setId(m_id);
    navigation.navigate("Movie_info");
  };

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

            const ratingRottenTomatoes = ratingData.Ratings.find(
              (rating) => rating.Source === "Rotten Tomatoes"
            );
            const ratingIMDB = ratingData.Ratings.find(
              (rating) => rating.Source === "Internet Movie Database"
            );

            return {
              ...movie,
              ratingR: ratingRottenTomatoes,
              ratingM: ratingIMDB,
            };
          })
        );
        setMovies(moviesWithRatings);
        saveRecentSearches(searchQuery); // Save recent search
        setSearchPerformed(true); // Set search performed to true
      } else {
        setMovies([]);
        setSearchPerformed(true); // Set search performed to true even if no results found
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

    return (
      <Pressable onPress={() => handlepress(item.imdbID)}>
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
            {item.ratingR ? (
              <View>
                <Text
                  style={{ fontStyle: "italic", color: "#4B5563" }}
                >{`Rotten Tomatoes: ${item.ratingR.Value}`}</Text>
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
                      width: item.ratingR.Value,
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
                <Text
                  style={{ fontStyle: "italic", color: "#4B5563" }}
                >{`IMDB: ${item.ratingM.Value}`}</Text>
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
                      width: `${
                        parseFloat(item.ratingM.Value.split("/")[0]) * 10
                      }%`,
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
              <Text>Not rated yet</Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <>
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

        {searchPerformed && movies.length === 0 && (
          <Text style={{ alignSelf: "center", marginTop: 20 }}>
            No results found
          </Text>
        )}

        {movies.length > 0 && (
          <FlatList
            data={movies}
            renderItem={renderItem}
            keyExtractor={(item) => item.imdbID}
            style={{ marginBottom: 36 }}
          />
        )}

        {loading && <Text>Loading...</Text>}
        {error && <Text>Error: {error.message}</Text>}

        <View style={{ marginHorizontal: "12%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            [Recent Searches]
          </Text>
          <FlatList
            data={recentSearches}
            renderItem={({ item }) => (
              <Pressable onPress={() => setSearchQuery(item)}>
                <Text style={{ fontSize: 16 }}>{item}</Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </>
  );
};

export default Search;
