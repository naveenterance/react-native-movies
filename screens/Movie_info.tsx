import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Image, Pressable, Alert } from "react-native";
import {
  AntDesign,
  MaterialIcons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_USERS,
  ADD_USER,
  DELETE_USER,
  UPDATE_USER,
} from "../utils/graphql";
import { useAuth } from "../utils/Auth";
import { useID } from "../utils/CurrentId";
import { theme, Theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import Drawer_button from "../components/Drawer_button";
import {
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import Loader from "../components/Loader";
import { styles_movie_info } from "../styles/movie_info";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/RootParams";

type Movie_infoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Movie_info"
>;
interface Movie_infoProps {
  navigation: Movie_infoScreenNavigationProp;
}

interface UserMovie {
  movieId: string;
  username: string;
  rating: string;
  review: string;
}
interface rating {
  Source: string;
  Value: string;
}

const Movie_info: React.FC<Movie_infoProps> = ({ navigation }) => {
  const { current } = useTheme();
  const { username } = useAuth();
  const { id, setId } = useID();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const { error, data, refetch } = useQuery(GET_ALL_USERS);
  const [addUser] = useMutation(ADD_USER);
  const [movieData, setMovieData] = useState<any | null>(null);
  const API_KEY = "e24ea998";
  const [refreshPage, setRefreshPage] = useState(false);
  const [deleteUser] = useMutation(DELETE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [editView, setEditView] = useState(false);
  const textInputRef = useRef(null);
  const currentTheme = theme[current as keyof Theme];

  const focusOnTextInput = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleRatingChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const numericRating = Math.min(Math.max(parseInt(numericValue), 0), 100);
    setRating(numericRating.toString());
  };

  const handleEditView = () => {
    setEditView(true);
    focusOnTextInput();
  };
  useEffect(() => {
    if (editView) {
      focusOnTextInput();
    }
  }, [editView]);

  useEffect(() => {
    const fetchData = async () => {
      setEditView(false);
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
    refetch();
    fetchData();
  }, [refreshPage, id]);

  useEffect(() => {
    const fetchData = async () => {
      setEditView(false);
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

    return movieData.Ratings.map((rating: rating, index: number) => {
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
            color: currentTheme.charcoal,
          }}
        >
          {ratingText}
        </Text>
      );
    });
  };

  const handleSubmit = async (id: string) => {
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
      Alert.alert("Success", "Added review");
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
              Alert.alert("Success", "All progress deleted!");
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
      Alert.alert("Success", "Review and rating updated !");
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
      Alert.alert("Success", "Status updated to watched!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update user. Please try again later.");
    }
  };

  const addToWatchlist = async (id: string) => {
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
      Alert.alert("Success", "Added to Bookmarks!");
      setLoading(false);
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const userRating = data?.allUsers?.find(
    (userMovie: UserMovie) =>
      userMovie.movieId === id && userMovie.username === username
  )?.rating;

  const userReview = data?.allUsers?.find(
    (userMovie: UserMovie) =>
      userMovie.movieId === id && userMovie.username === username
  )?.review;
  useEffect(() => {
    setRating(userRating);
    setReview(userReview);
  }, [userRating, userReview]);

  const allRatingsAndReviews =
    data && data.allUsers
      ? data.allUsers
          .filter(
            (userMovie: UserMovie) =>
              userMovie.movieId === id && userMovie.username !== username
          )
          .map((userMovie: UserMovie) => ({
            username: userMovie.username,
            rating: userMovie.rating,
            review: userMovie.review,
          }))
      : [];

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.white }}>
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
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 500,
                  color: currentTheme.charcoal,
                }}
              >
                {movieData.Title} [{movieData.Year}]
              </Text>
            </View>
            {!loading ? (
              <View style={styles_movie_info.progress_container}>
                {!userReview ? (
                  <Pressable
                    style={({ pressed }) => [
                      {
                        flexDirection: "column",
                        alignContent: "center",
                        alignItems: "center",
                        borderBottomWidth: pressed ? 4 : 0,
                        borderColor: currentTheme.orange,
                      },
                    ]}
                    onPress={() => addToWatchlist(id)}
                  >
                    <MaterialCommunityIcons
                      name="bookmark-plus-outline"
                      size={32}
                      color={currentTheme.charcoal}
                    />
                    <Text
                      style={{ fontSize: 16, color: currentTheme.charcoal }}
                    >
                      Bookmark
                    </Text>
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
                      color={currentTheme.green}
                    />
                    <Text style={{ color: currentTheme.green, fontSize: 16 }}>
                      Bookmarked
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles_movie_info.bar,
                    {
                      backgroundColor: userReview
                        ? currentTheme.green
                        : currentTheme.gray,
                    },
                  ]}
                ></View>
                {userReview == "[to be watched]" || !userReview ? (
                  <Pressable
                    style={({ pressed }) => [
                      {
                        flexDirection: "column",
                        alignContent: "center",
                        alignItems: "center",
                        borderBottomWidth: pressed ? 4 : 0,
                        borderColor: currentTheme.orange,
                      },
                    ]}
                    onPress={() => UpdateStatus()}
                    disabled={!userReview ? true : false}
                  >
                    <MaterialCommunityIcons
                      name="eye-outline"
                      size={32}
                      color={
                        userReview == "[to be watched]"
                          ? currentTheme.charcoal
                          : currentTheme.gray
                      }
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          userReview == "[to be watched]"
                            ? currentTheme.charcoal
                            : currentTheme.gray,
                      }}
                    >
                      Watched
                    </Text>
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
                      color={currentTheme.green}
                    />
                    <Text style={{ fontSize: 16, color: currentTheme.green }}>
                      Watched
                    </Text>
                  </View>
                )}

                <View
                  style={[
                    styles_movie_info.bar,
                    {
                      backgroundColor: !isNaN(userRating)
                        ? currentTheme.green
                        : currentTheme.gray,
                    },
                  ]}
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
                        borderColor: currentTheme.orange,
                      },
                    ]}
                    disabled={userReview == "[watched]" ? false : true}
                    onPress={handleEditView}
                  >
                    <MaterialCommunityIcons
                      name="movie-outline"
                      size={32}
                      color={
                        userReview == "[watched]"
                          ? currentTheme.charcoal
                          : currentTheme.gray
                      }
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          userReview == "[watched]"
                            ? currentTheme.charcoal
                            : currentTheme.gray,
                      }}
                    >
                      Rate
                    </Text>
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
                      color={currentTheme.green}
                    />
                    <Text style={{ fontSize: 16, color: currentTheme.green }}>
                      Rated
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <Loader width={210} height={210} />
            )}

            <Pressable
              style={({ pressed }) => [
                {
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",

                  padding: "2%",
                  marginBottom: "10%",
                  backgroundColor: pressed
                    ? currentTheme.gray
                    : currentTheme.white,
                },
              ]}
              onPress={handleDelete}
            >
              <Ionicons
                name="trash-bin-outline"
                size={36}
                color={currentTheme.red}
              />
              <Text style={{ marginTop: "2%", color: currentTheme.red }}>
                {" "}
                Delete all progress
              </Text>
            </Pressable>

            <View style={{ paddingHorizontal: "2%" }}>
              <Text style={{ color: currentTheme.charcoal }}>
                Rated:{" "}
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {movieData.Rated}
                </Text>
              </Text>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <AntDesign
                  style={{ marginRight: "2%" }}
                  name="calendar"
                  size={24}
                  color={currentTheme.charcoal}
                />
                <Text style={{ color: currentTheme.charcoal }}>
                  Released: {movieData.Released}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <Entypo
                  style={{ marginRight: "2%" }}
                  name="stopwatch"
                  size={24}
                  color={currentTheme.charcoal}
                />
                <Text style={{ color: currentTheme.charcoal }}>
                  Runtime: {movieData.Runtime}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <MaterialCommunityIcons
                  style={{ marginRight: "2%" }}
                  name="drama-masks"
                  size={24}
                  color={currentTheme.charcoal}
                />
                <Text style={{ color: currentTheme.charcoal }}>
                  Genre: {movieData.Genre}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <AntDesign
                  style={{ marginRight: "2%" }}
                  name="videocamera"
                  size={24}
                  color={currentTheme.charcoal}
                />
                <Text style={{ color: currentTheme.charcoal }}>
                  Director: {movieData.Director}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <Feather
                  style={{ marginRight: "2%" }}
                  name="pen-tool"
                  size={24}
                  color={currentTheme.charcoal}
                />
                <Text style={{ color: currentTheme.charcoal }}>
                  Writer: {movieData.Writer}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <MaterialCommunityIcons
                  style={{ marginRight: "2%" }}
                  name="face-recognition"
                  size={24}
                  color={currentTheme.charcoal}
                />
                <Text style={{ color: currentTheme.charcoal }}>
                  Actors: {movieData.Actors}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <FontAwesome
                  style={{ marginRight: "2%" }}
                  name="language"
                  size={24}
                  color={currentTheme.charcoal}
                />
                <Text style={{ color: currentTheme.charcoal }}>
                  Language: {movieData.Language}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <Feather
                  style={{ marginRight: "2%" }}
                  name="flag"
                  size={24}
                  color={currentTheme.charcoal}
                />
                <Text style={{ color: currentTheme.charcoal }}>
                  Country: {movieData.Country}
                </Text>
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
                  color={currentTheme.charcoal}
                />
                <Text style={{ width: 400, color: currentTheme.charcoal }}>
                  {movieData.Awards}
                </Text>
              </View>
              <Text style={{ width: 400, color: currentTheme.charcoal }}>
                Plot: {movieData.Plot}
              </Text>
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
                    color: currentTheme.gray,
                  }}
                >
                  No reviews yet
                </Text>
                {userRating == "[watched]" && (
                  <Pressable onPress={handleEditView}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "900",
                        color: currentTheme.charcoal,
                      }}
                    >
                      Add ?
                    </Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <View style={{ marginHorizontal: "8%", marginVertical: "5%" }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: currentTheme.charcoal,
                  }}
                >
                  <MaterialIcons
                    name="rate-review"
                    size={28}
                    color={currentTheme.charcoal}
                  />
                  Reviews
                </Text>
              </View>
            )}

            {!editView ? (
              userRating &&
              !isNaN(userRating) && (
                <Pressable onPress={handleEditView}>
                  <View
                    style={{
                      marginVertical: 5,
                      paddingHorizontal: "5%",
                    }}
                  >
                    <Text style={{ color: currentTheme.charcoal }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "600",
                          color: currentTheme.charcoal,
                        }}
                      >
                        You
                        <Text style={{ color: currentTheme.orange }}>
                          {" "}
                          [ {userRating} %]
                          <Entypo
                            name="pencil"
                            size={24}
                            color={currentTheme.charcoal}
                          />
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
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: currentTheme.charcoal,
                    }}
                  >
                    Rate on a scale of 0 -100
                  </Text>
                  <TextInput
                    style={[
                      styles_movie_info.textInput_rating,
                      {
                        color: currentTheme.charcoal,
                        borderColor: currentTheme.gray,
                      },
                    ]}
                    value={!isNaN(rating) ? rating : ""}
                    selectionColor={currentTheme.orange}
                    keyboardType="numeric"
                    onChangeText={handleRatingChange}
                  />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 24,
                      fontWeight: "400",
                      color: currentTheme.charcoal,
                    }}
                  >
                    %
                  </Text>
                </View>
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: currentTheme.charcoal,
                    }}
                  >
                    Write a review
                  </Text>
                  <TextInput
                    style={[
                      styles_movie_info.textInput_review,
                      {
                        color: currentTheme.charcoal,
                        borderColor: currentTheme.gray,
                      },
                    ]}
                    ref={textInputRef}
                    multiline={true}
                    numberOfLines={10}
                    selectionColor={currentTheme.orange}
                    value={
                      review != "[watched]" && review != "[to be watched]"
                        ? review
                        : ""
                    }
                    onChangeText={setReview}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
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
                      color={currentTheme.red}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: currentTheme.red,
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      Discard
                    </Text>
                  </Pressable>
                  {userReview && userReview.length <= 0 ? (
                    <Pressable
                      style={{ flexDirection: "row", marginTop: "5%" }}
                      onPress={() => handleSubmit(id)}
                    >
                      <Feather
                        name="check"
                        size={30}
                        color={currentTheme.green}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: currentTheme.green,
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
                        color={currentTheme.green}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: currentTheme.green,
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
              <Loader height={210} width={210} />
            )}
            <View>
              {allRatingsAndReviews.map(
                (item: UserMovie, index: number) =>
                  item.review !== "[to be watched]" &&
                  item.review !== "[watched]" && (
                    <View
                      key={index}
                      style={{
                        marginVertical: 5,
                        paddingHorizontal: "5%",
                      }}
                    >
                      <Text style={{ color: currentTheme.charcoal }}>
                        <Text style={{ fontSize: 18, fontWeight: "600" }}>
                          {item.username}{" "}
                          <Text style={{ color: currentTheme.orange }}>
                            {" "}
                            [ {item.rating} %]
                          </Text>{" "}
                          :
                        </Text>
                        {item.review}
                      </Text>
                    </View>
                  )
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <Loader width={210} height={210} />
      )}
    </View>
  );
};

export default Movie_info;
