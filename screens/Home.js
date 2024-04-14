import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import "core-js/stable/atob";

import { useQuery, gql, useMutation } from "@apollo/client";
import AddUserForm from "../components/Add";

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

const ADD_USER = gql`
  mutation CreateUser($username: String!, $movieId: String!, $rating: String!) {
    create(username: $username, movieId: $movieId, rating: $rating) {
      id
      username
      movieId
      rating
    }
  }
`;

const HomeScreen = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [addUser] = useMutation(ADD_USER);

  const API_KEY = "e24ea998";
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [movieId, setMovieId] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (token) {
          const decoded = jwtDecode(token);
          setUser(decoded);
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
    setMovieId(id);
    try {
      await addUser({
        variables: {
          username,
          movieId,
          rating,
        },
      });

      setUsername("");
      setMovieId("");
      setRating("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View className="m-2 bg-gray-200 p-4 flex-row rounded-lg ">
      <Image
        style={{ height: 80, width: 80 }}
        source={{
          uri: `http://img.omdbapi.com/?apikey=${API_KEY}&i=${item.imdbID}`,
        }}
      />
      <View className="w-3/4 px-4 ">
        <Text className="truncate text-gray-800">
          {item.Title}{" "}
          <Text className="italic text-gray-800">[{item.Year}]</Text>
        </Text>

        {item.rating ? (
          <View>
            <Text className="italic text-gray-800">{`Critics: ${item.rating.Value}`}</Text>
            <View className="w-full bg-gray-200 rounded-full h-2">
              <View
                style={{ width: item.rating.Value }}
                className="bg-orange-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              >
                <Text></Text>
              </View>
            </View>
          </View>
        ) : (
          <Text className="italic text-gray-800">No ratings</Text>
        )}

        <View>
          <TextInput
            className="border-4 border-gray-600  px-2 m-1 rounded-xl w-1/2  focus:border-600 mb-4"
            placeholder="Enter your rating"
            onChangeText={setRating}
          />

          <Button onPress={() => handleSubmit(item.imdbID)} title="Rate" />
          {/* 
            <View className="w-full bg-gray-200 rounded-full h-2">
              <View
                style={{ width: userRating }}
                className="bg-gray-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              ></View>
            </View> */}
        </View>
      </View>
    </View>
  );

  return (
    <View>
      <View className="p-4 bg-orange-600  flex-row  w-full">
        <Pressable
          className="mt-12"
          onPress={() => navigation.navigate("Profile")}
        >
          <MaterialCommunityIcons name="menu" size={36} color="black" />
        </Pressable>
        <TextInput
          className="bg-gray-200 w-3/4 mx-4 mt-12 px-4  py-2 rounded-full "
          placeholder="Search for movies..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={searchMovies}
        />
        <Pressable onPress={searchMovies} className="mt-12">
          <FontAwesome name="search" size={36} color="black" />
        </Pressable>
      </View>

      <FlatList
        className="mb-36"
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.imdbID}
      />
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {data && data.allUsers && (
        <>
          <Text>User List</Text>
          <FlatList
            data={data.allUsers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <Text>ID: {item.id}</Text>
                <Text>Username: {item.username}</Text>
                <Text>Movie ID: {item.movieId}</Text>
                <Text>Rating: {item.rating}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

export default HomeScreen;
