import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import {
  AntDesign,
  MaterialIcons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";

import { ScrollView } from "react-native-gesture-handler";
import { useQuery, gql, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

import { GET_ALL_USERS } from "../utils/graphql";
import { ADD_USER } from "../utils/graphql";
import { DELETE_USER } from "../utils/graphql";
import { UPDATE_USER } from "../utils/graphql";
import { useAuth } from "../utils/Auth";
import { useID } from "../utils/CurrentId";
import Modal_custom from "../components/Drawer";

import { useModal } from "../utils/Modal";

const Movie_info = ({ navigation }) => {
  const { modalVisible, setModalVisible } = useModal();
  const { username } = useAuth();
  const { id, setId } = useID();

  if (!id) {
    return;
  }

  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const [addUser] = useMutation(ADD_USER);
  const [movieData, setMovieData] = useState(null);
  const API_KEY = "e24ea998";
  const [refreshPage, setRefreshPage] = useState(false);
  const [deleteUser] = useMutation(DELETE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
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
  }, [refreshPage]);

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

  const renderRatings = () => {
    if (!movieData.Ratings) return null;

    return movieData.Ratings.map((rating, index) => {
      const ratingText =
        rating.Source === "Internet Movie Database"
          ? `IMDb: ${rating.Value}`
          : rating.Source === "Rotten Tomatoes"
          ? `Rotten Tomatoes: ${rating.Value}`
          : rating.Source === "Metacritic"
          ? `Metacritic: ${rating.Value}`
          : `Not rated yet`;

      return (
        <Text key={index} style={styles.rating}>
          {ratingText}
        </Text>
      );
    });
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
      refetch();
    } catch (error) {
      console.error("Error rating movie:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser({ variables: { username, movieId: id } });
      Alert.alert("Success", "User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert("Error", "Failed to delete user. Please try again later.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser({
        variables: { username, movieId: id, rating, review },
      });
      Alert.alert("Success", "User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update user. Please try again later.");
    }
  };

  const watch = "[to be watched]";
  const addToWatchlist = async (id) => {
    try {
      await addUser({
        variables: {
          username,
          movieId: id,
          rating: watch,
          review: watch,
        },
      });
      refetch();
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const userRating =
    data && data.allUsers
      ? data.allUsers.find(
          (userMovie) =>
            userMovie.movieId === id && userMovie.username === username
        )?.rating
      : null;

  return (
    <View style={{ flex: 1 }}>
      {movieData ? (
        <ScrollView>
          <View>
            <Modal_custom
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            />

            <Button title="modal " onPress={() => setModalVisible(true)} />
            <Image
              source={{ uri: movieData.Poster }}
              style={{ width: "100%", height: 600 }}
            />
            <Text>Title: {movieData.Title}</Text>
            <Pressable onPress={() => addToWatchlist(id)}>
              <Feather name="bookmark" size={30} color="black" />
            </Pressable>
            <Button title="delete bookmark" onPress={handleDelete} />
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
            <Text>Reviews:</Text>
            {renderRatings()}
            {userRating && (
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
            )}

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
              {!userRating ? (
                <Button onPress={() => handleSubmit(id)} title="Rate" />
              ) : (
                <Button title="Update" onPress={handleUpdate} />
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rating: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Movie_info;
