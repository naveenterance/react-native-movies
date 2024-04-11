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

const HomeScreen = ({ navigation }) => {
  const API_KEY = "e24ea998";
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);

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
        {item.rating && (
          <View>
            <Text className="italic text-gray-800">{`You: ${item.rating.Value}`}</Text>

            <View className="w-full bg-gray-200 rounded-full h-2">
              <View
                style={{ width: item.rating.Value }}
                className="bg-gray-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              >
                <Text></Text>
              </View>
            </View>
          </View>
        )}
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
    </View>
  );
};

export default HomeScreen;
