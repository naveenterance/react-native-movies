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
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";

import { useModal } from "../utils/Modal";
import Drawer_button from "../components/Drawer_button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const Movie_info = ({ navigation }) => {
  const { current } = useTheme();
  const { modalVisible, setModalVisible } = useModal();
  const { username } = useAuth();
  const { id, setId } = useID();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const { error, data, refetch } = useQuery(GET_ALL_USERS);
  const [addUser] = useMutation(ADD_USER);
  const [movieData, setMovieData] = useState(null);
  const API_KEY = "e24ea998";
  const [refreshPage, setRefreshPage] = useState(false);
  const [deleteUser] = useMutation(DELETE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [editView, setEditView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
        );
        const data = await response.json();
        setMovieData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refreshPage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
        );
        const data = await response.json();
        setMovieData(data);
        setLoading(false);
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
        <Text
          key={index}
          style={{
            padding: "1%",
            fontSize: 16,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {ratingText}
        </Text>
      );
    });
  };

  const handleSubmit = async (id) => {
    setLoading(true);
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
      Alert.alert("Success", "User updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error rating movie:", error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete your progress?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteUser({ variables: { username, movieId: id } });
              refetch();
              Alert.alert("Success", "User deleted successfully!");
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert(
                "Error",
                "Failed to delete user. Please try again later."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateUser({
        variables: { username, movieId: id, rating, review },
      });
      refetch();
      Alert.alert("Success", "User updated successfully!");
      setEditView(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update user. Please try again later.");
    }
  };
  const UpdateStatus = async () => {
    setLoading(true);
    try {
      await updateUser({
        variables: {
          username,
          movieId: id,
          rating: "[watched]",
          review: "[watched]",
        },
      });
      refetch();
      Alert.alert("Success", "User updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update user. Please try again later.");
    }
  };

  const addToWatchlist = async (id) => {
    setLoading(true);
    try {
      await addUser({
        variables: {
          username,
          movieId: id,
          rating: "[to be watched]",
          review: "[to be watched]",
        },
      });
      refetch();
      Alert.alert("Success", "User updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const userRating = data?.allUsers?.find(
    (userMovie) => userMovie.movieId === id && userMovie.username === username
  )?.rating;

  const userReview = data?.allUsers?.find(
    (userMovie) => userMovie.movieId === id && userMovie.username === username
  )?.review;
  useEffect(() => {
    setRating(userRating);
    setReview(userReview);
  }, [userRating, userReview]);

  const allRatingsAndReviews =
    data && data.allUsers
      ? data.allUsers
          .filter(
            (userMovie) =>
              userMovie.movieId === id && userMovie.username !== username
          )
          .map((userMovie) => ({
            username: userMovie.username,
            rating: userMovie.rating,
            review: userMovie.review,
          }))
      : [];

  return (
    <View style={{ flex: 1, backgroundColor: theme[current].white }}>
      <Modal_custom
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />

      <Drawer_button />
      {movieData ? (
        <ScrollView>
          <View>
            <Image
              source={{ uri: movieData.Poster }}
              style={{ width: "100%", height: 600 }}
            />
            <View
              style={{
                marginTop: "5%",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 30, fontWeight: 500 }}>
                {movieData.Title} [{movieData.Year}]
              </Text>
            </View>
            {!loading ? (
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginVertical: "15%",
                  marginHorizontal: "5%",
                }}
              >
                {!userReview ? (
                  <Pressable
                    style={({ pressed }) => [
                      {
                        flexDirection: "column",
                        alignContent: "center",
                        alignItems: "center",

                        borderBottomWidth: pressed ? 4 : 0,
                        borderColor: theme[current].orange,
                      },
                    ]}
                    onPress={() => addToWatchlist(id)}
                  >
                    <MaterialCommunityIcons
                      name="bookmark-plus-outline"
                      size={32}
                      color="black"
                    />
                    <Text style={{ fontSize: 16 }}>Bookmark</Text>
                  </Pressable>
                ) : (
                  <View
                    style={{
                      flexDirection: "column",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="bookmark-check-outline"
                      size={32}
                      color={theme[current].green}
                    />
                    <Text style={{ color: theme[current].green, fontSize: 16 }}>
                      Bookmarked
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    width: "20%",
                    height: "1%",
                    backgroundColor: userReview
                      ? theme[current].green
                      : theme[current].gray,
                    alignItems: "center",
                    padding: 2,
                    borderRadius: 999,
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#4299E1",
                    textAlign: "center",
                    lineHeight: 12,
                    marginBottom: "3%",
                  }}
                ></View>
                {userReview == "[to be watched]" || !userReview ? (
                  <Pressable
                    style={({ pressed }) => [
                      {
                        flexDirection: "column",
                        alignContent: "center",
                        alignItems: "center",
                        borderBottomWidth: pressed ? 4 : 0,
                        borderColor: theme[current].orange,
                      },
                    ]}
                    onPress={() => UpdateStatus(id)}
                    disabled={!userReview ? true : false}
                  >
                    <MaterialCommunityIcons
                      name="eye-outline"
                      size={32}
                      color={userReview ? "black" : theme[current].gray}
                    />
                    <Text style={{ fontSize: 16 }}>Watched</Text>
                  </Pressable>
                ) : (
                  <View
                    style={{
                      flexDirection: "column",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="eye-check-outline"
                      size={32}
                      color={theme[current].green}
                    />
                    <Text style={{ fontSize: 16 }}>Watched</Text>
                  </View>
                )}

                <View
                  style={{
                    width: "20%",
                    height: "1%",
                    backgroundColor: !isNaN(userRating)
                      ? theme[current].green
                      : theme[current].gray,
                    alignItems: "center",
                    padding: 2,
                    borderRadius: 999,
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#4299E1",
                    textAlign: "center",
                    lineHeight: 12,
                    marginBottom: "3%",
                  }}
                ></View>

                {userReview == "[watched]" ||
                userReview == "[to be watched]" ||
                !userReview ? (
                  <Pressable
                    style={({ pressed }) => [
                      {
                        flexDirection: "column",
                        alignContent: "center",
                        alignItems: "center",
                        borderBottomWidth: pressed ? 4 : 0,
                        borderColor: theme[current].orange,
                      },
                    ]}
                    onPress={() => addToWatchlist(id)}
                  >
                    <MaterialCommunityIcons
                      name="movie-outline"
                      size={32}
                      color={
                        userRating == "[watched]"
                          ? "black"
                          : theme[current].gray
                      }
                    />
                    <Text style={{ fontSize: 16 }}>Rate</Text>
                  </Pressable>
                ) : (
                  <View
                    style={{
                      flexDirection: "column",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="movie-open-star-outline"
                      size={32}
                      color={theme[current].green}
                    />
                    <Text style={{ fontSize: 16 }}>Rate</Text>
                  </View>
                )}
              </View>
            ) : (
              <LottieView
                style={{
                  width: 210,
                  height: 210,

                  alignSelf: "center",
                }}
                source={require("../assets/loader4.json")}
                autoPlay
                loop
              />
            )}

            <Pressable
              style={({ pressed }) => [
                {
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignContent: "center",
                  backgroundColor: pressed
                    ? theme[current].gray
                    : theme[current].white,
                  padding: "2%",
                  marginBottom: "10%",
                },
              ]}
              onPress={handleDelete}
            >
              <Ionicons
                name="trash-bin-outline"
                size={36}
                color={theme[current].red}
              />
              <Text style={{ marginTop: "2%", color: theme[current].red }}>
                {" "}
                Delete all progress
              </Text>
            </Pressable>
            <View style={{ paddingHorizontal: "2%" }}>
              <Text>
                Rated:{" "}
                <Text style={{ fontSize: 20, fontWeight: 600 }}>
                  {movieData.Rated}
                </Text>
              </Text>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <AntDesign
                  style={{ marginRight: "2%" }}
                  name="calendar"
                  size={24}
                  color="black"
                />
                <Text>Released: {movieData.Released}</Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <Entypo
                  style={{ marginRight: "2%" }}
                  name="stopwatch"
                  size={24}
                  color="black"
                />
                <Text>Runtime: {movieData.Runtime}</Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <MaterialCommunityIcons
                  style={{ marginRight: "2%" }}
                  name="drama-masks"
                  size={24}
                  color="black"
                />
                <Text>Genre: {movieData.Genre}</Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <AntDesign
                  style={{ marginRight: "2%" }}
                  name="videocamera"
                  size={24}
                  color="black"
                />
                <Text>Director: {movieData.Director}</Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <Feather
                  style={{ marginRight: "2%" }}
                  name="pen-tool"
                  size={24}
                  color="black"
                />
                <Text>Writer: {movieData.Writer}</Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <MaterialCommunityIcons
                  style={{ marginRight: "2%" }}
                  name="face-recognition"
                  size={24}
                  color="black"
                />
                <Text>Actors: {movieData.Actors}</Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <FontAwesome
                  style={{ marginRight: "2%" }}
                  name="language"
                  size={24}
                  color="black"
                />
                <Text>Language: {movieData.Language}</Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <Feather
                  style={{ marginRight: "2%" }}
                  name="flag"
                  size={24}
                  color="black"
                />
                <Text>Country: {movieData.Country}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: "2%",
                  width: "80%",
                }}
              >
                <FontAwesome5
                  style={{ marginRight: "2%" }}
                  name="award"
                  size={24}
                  color="black"
                />
                <Text style={{ width: 400 }}>{movieData.Awards}</Text>
              </View>
              <Text style={{ width: 400 }}>Plot: {movieData.Plot}</Text>
            </View>
            <View style={{ marginVertical: "5%", marginLeft: "2%" }}>
              {renderRatings()}
            </View>

            {allRatingsAndReviews.length <= 0 &&
            (!userRating || isNaN(userRating)) &&
            !editView ? (
              <View style={{ marginHorizontal: "8%", marginVertical: "5%" }}>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "900",
                    color: theme[current].gray,
                  }}
                >
                  No reviews yet
                </Text>
                <Pressable onPress={() => setEditView(true)}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "900",
                    }}
                  >
                    Add ?
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={{ marginHorizontal: "8%", marginVertical: "5%" }}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  <MaterialIcons name="rate-review" size={28} color="black" />
                  Reviews
                </Text>
              </View>
            )}

            {!editView ? (
              userRating &&
              !isNaN(userRating) && (
                <Pressable onPress={() => setEditView(!editView)}>
                  <View
                    style={{
                      marginVertical: 5,
                      paddingHorizontal: "5%",
                    }}
                  >
                    <Text style={{}}>
                      <Text style={{ fontSize: 22, fontWeight: 600 }}>
                        You
                        <Text style={{ color: theme[current].orange }}>
                          {" "}
                          [ {userRating} %]
                          <Entypo name="pencil" size={24} color="black" />
                        </Text>{" "}
                        :
                      </Text>{" "}
                      {userReview}
                    </Text>
                  </View>
                </Pressable>
              )
            ) : !loading ? (
              <View style={{ paddingHorizontal: "5%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    Rate on a scale of 0 -100
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 4,
                      borderColor: "#4B5563",
                      width: "15%",
                      padding: 8,
                      marginLeft: "10%",
                      fontSize: 20,
                      fontWeight: "600",

                      borderRadius: 8,
                    }}
                    value={!isNaN(rating) ? rating : ""}
                    selectionColor={theme[current].orange}
                    onChangeText={setRating}
                  />
                  <Text
                    style={{ marginLeft: 20, fontSize: 24, fontWeight: "400" }}
                  >
                    %
                  </Text>
                </View>
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    Write a review
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 4,
                      borderColor: "#4B5563",
                      padding: 10,

                      fontSize: 14,

                      borderRadius: 8,
                    }}
                    multiline={true}
                    numberOfLines={10}
                    value={
                      review != ("[watched]" && "[to be watched]") ? review : ""
                    }
                    onChangeText={() => setReview}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100% ",
                    justifyContent: "space-around",
                    marginBottom: "10%",
                  }}
                >
                  <Pressable
                    style={{ flexDirection: "row", marginTop: "5%" }}
                    onPress={() => setEditView(false)}
                  >
                    <MaterialIcons
                      name="clear"
                      size={30}
                      color={theme[current].red}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: theme[current].red,
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      Discard
                    </Text>
                  </Pressable>
                  {userReview.length <= 0 ? (
                    <Pressable
                      style={{ flexDirection: "row", marginTop: "5%" }}
                      onPress={() => handleSubmit(id)}
                    >
                      <Feather
                        name="check"
                        size={30}
                        color={theme[current].green}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: theme[current].green,
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Add Review
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={{ flexDirection: "row", marginTop: "5%" }}
                      onPress={handleUpdate}
                    >
                      <Feather
                        name="check"
                        size={30}
                        color={theme[current].green}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: theme[current].green,
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Update
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ) : (
              <LottieView
                style={{
                  width: 210,
                  height: 210,

                  alignSelf: "center",
                }}
                source={require("../assets/loader4.json")}
                autoPlay
                loop
              />
            )}
            <View>
              {allRatingsAndReviews.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginVertical: 5,
                    paddingHorizontal: "5%",
                  }}
                >
                  <Text style={{}}>
                    <Text style={{ fontSize: 18, fontWeight: 600 }}>
                      {item.username}{" "}
                      <Text style={{ color: theme[current].orange }}>
                        {" "}
                        [ {item.rating} %]
                      </Text>{" "}
                      :
                    </Text>
                    {item.review}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <LottieView
          style={{
            width: 210,
            height: 210,

            alignSelf: "center",
          }}
          source={require("../assets/loader4.json")}
          autoPlay
          loop
        />
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
