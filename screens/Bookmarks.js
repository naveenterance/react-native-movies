import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Button,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../utils/graphql";
import { useAuth } from "../utils/Auth";
import { useID } from "../utils/CurrentId";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { BackHandler, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Drawer_button from "../components/Drawer_button";
import { useSearchTerm } from "../utils/SearchTerm";

const Bookmarks = ({ navigation }) => {
  const { current } = useTheme();
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const { username } = useAuth();
  const { id, setId } = useID();
  const [movies, setMovies] = useState([]);
  const [view, setView] = useState("bookmarks");
  const { searchedUser, setSearchedUser } = useSearchTerm();

  const API_KEY = "e24ea998";

  useFocusEffect(
    useCallback(() => {
      const handleBeforeRemove = () => {
        setSearchedUser("");
      };
      navigation.addListener("beforeRemove", handleBeforeRemove);
      return () => {
        navigation.removeListener("beforeRemove", handleBeforeRemove);
      };
    }, [navigation])
  );

  useEffect(() => {
    const fetchData = async () => {
      if (data && data.allUsers) {
        const bookmarkedMovies = data.allUsers.filter((user) => {
          return (
            user.username === (searchedUser ? searchedUser : username) &&
            ((view === "rated" && !isNaN(user.rating)) ||
              (view === "bookmarks" && user.rating === "[to be watched]") ||
              (view === "watched" && user.rating === "[watched]") ||
              (view === "" && true))
          );
        });

        const moviesWithRatings = await Promise.all(
          bookmarkedMovies.map(async (user) => {
            const ratingResponse = await fetch(
              `http://www.omdbapi.com/?apikey=${API_KEY}&i=${user.movieId}&plot=full`
            );
            const details = await ratingResponse.json();

            const ratingRottenTomatoes = details.Ratings.find(
              (rating) => rating.Source === "Rotten Tomatoes"
            );
            const ratingIMDB = details.Ratings.find(
              (rating) => rating.Source === "Internet Movie Database"
            );

            return {
              imdbID: details.imdbID,
              Title: details.Title,
              Year: details.Year,
              Language: details.Language,
              Poster: details.Poster,
              Genre: details.Genre,
              Country: details.Country,
              ratingR: ratingRottenTomatoes,
              ratingM: ratingIMDB,
            };
          })
        );
        setMovies(moviesWithRatings);
      }
    };

    fetchData();
  }, [data, username, view, searchedUser]);

  const handlepress = (m_id) => {
    setId(m_id);
    navigation.navigate("Movie_info");
  };

  const renderItem = ({ item }) => {
    const userRating =
      data && data.allUsers
        ? data.allUsers.find(
            (userMovie) =>
              userMovie.movieId === item.imdbID &&
              userMovie.username === (searchedUser ? searchedUser : username)
          )?.rating
        : null;

    return (
      <View>
        <Pressable onPress={() => handlepress(item.imdbID)}>
          <View
            style={{
              margin: 8,
              backgroundColor: theme[current].white,
              padding: 8,
              borderRadius: 8,
              flexDirection: "row",
              // borderWidth: userRating && 4,
              // borderColor: userRating && theme[current].blue,
            }}
          >
            <View>
              <Image
                style={{ height: 120, width: 80 }}
                source={{ uri: item.Poster }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text
                numberOfLines={2}
                style={{ color: "#4B5563", fontSize: 16, fontWeight: 700 }}
              >
                {item.Title}{" "}
              </Text>
              <Text style={{ fontStyle: "italic", color: "#4B5563" }}>
                [{item.Year}] [{item.Genre}] [{item.Language}][{item.Country}]
              </Text>

              <View style={{ width: "50%", flexDirection: "row" }}>
                {item.ratingR ? (
                  <View style={{ marginRight: "4%" }}>
                    <Text
                      style={{ fontStyle: "italic", color: "#4B5563" }}
                    >{`Critics: ${item.ratingR.Value}`}</Text>
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
                          backgroundColor: theme[current].rotten,
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
                ) : null}
                {item.ratingM ? (
                  <View>
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
                          backgroundColor: theme[current].imdb,
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
                ) : null}
              </View>

              {userRating &&
                userRating !== "[to be watched]" &&
                userRating !== "[watched]" && (
                  <View style={{ width: "90%", flexDirection: "row" }}>
                    <MaterialCommunityIcons
                      name="certificate-outline"
                      size={36}
                      color={theme[current].orange}
                    />
                    <View>
                      <Text
                        style={{
                          fontStyle: "italic",
                          color: "#4B5563",
                          fontSize: 20,
                          fontWeight: "500",
                        }}
                      >
                        {searchedUser
                          ? `${searchedUser}'s rating: ${parseFloat(
                              userRating
                            )}%`
                          : `Your rating: ${parseFloat(userRating)}%`}
                      </Text>

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
                            backgroundColor: theme[current].blue,
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
                )}
              {userRating == "[to be watched]" && (
                <View style={{ flexDirection: "row", margin: "1%" }}>
                  <Feather
                    name="bookmark"
                    size={36}
                    color={theme[current].green}
                  />
                  <Text
                    style={{
                      marginTop: "2%",
                      fontSize: 16,
                      fontWeight: "500",
                      color: theme[current].green,
                    }}
                  >
                    Bookmarked
                  </Text>
                </View>
              )}
              {userRating == "[watched]" && (
                <View style={{ flexDirection: "row", margin: "1%" }}>
                  <AntDesign
                    name="eyeo"
                    size={36}
                    color={theme[current].blue}
                  />
                  <Text
                    style={{
                      marginTop: "2%",
                      fontSize: 16,
                      fontWeight: "500",
                      color: theme[current].blue,
                    }}
                  >
                    Watched
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme[current].white,
        paddingBottom: 110,
      }}
    >
      <Drawer_button />
      <Pressable onPress={() => setSearchedUser("")}>
        <Text>{searchedUser}'s movie lists</Text>
      </Pressable>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Pressable
            onPress={() => setView(view == "bookmarks" ? "" : "bookmarks")}
            style={({ pressed }) => [
              {
                paddingVertical: "2%",
                paddingHorizontal: "5%",
                backgroundColor: pressed
                  ? theme[current].gray
                  : theme[current].white,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                borderBottomWidth: view == "bookmarks" ? 4 : 0,
                borderBottomColor: theme[current].orange,
              }}
            >
              <MaterialCommunityIcons
                name="bookmark-multiple-outline"
                size={30}
                color={theme[current].charcoal}
              />
              <Text>Bookmarks</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setView(view == "watched" ? "" : "watched")}
            style={({ pressed }) => [
              {
                paddingVertical: "2%",
                paddingHorizontal: "5%",
                backgroundColor: pressed
                  ? theme[current].gray
                  : theme[current].white,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                borderBottomWidth: view == "watched" ? 4 : 0,
                borderBottomColor: theme[current].orange,
              }}
            >
              <AntDesign
                name="eyeo"
                size={30}
                color={theme[current].charcoal}
              />
              <Text>Watched</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setView(view == "rated" ? "" : "rated")}
            style={({ pressed }) => [
              {
                paddingVertical: "2%",
                paddingHorizontal: "5%",
                backgroundColor: pressed
                  ? theme[current].gray
                  : theme[current].white,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                borderBottomWidth: view == "rated" ? 4 : 0,
                borderBottomColor: theme[current].orange,
              }}
            >
              <MaterialCommunityIcons
                name="movie-check-outline"
                size={30}
                color="black"
              />
              <Text>Rated</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Search")}
            style={({ pressed }) => [
              {
                paddingVertical: "2%",
                paddingHorizontal: "5%",
                backgroundColor: pressed
                  ? theme[current].gray
                  : theme[current].white,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="movie-search-outline"
                size={30}
                color="black"
              />
              <Text>Search</Text>
            </View>
          </Pressable>
        </View>

        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.imdbID}
          style={{ marginBottom: 36 }}
        />
      </View>
    </View>
  );
};

export default Bookmarks;
