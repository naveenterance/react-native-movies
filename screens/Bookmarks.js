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
import LottieView from "lottie-react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const Bookmarks = ({ navigation }) => {
  const { current } = useTheme();
  const { error, data, refetch } = useQuery(GET_ALL_USERS);
  const { username } = useAuth();
  const { id, setId } = useID();
  const [movies, setMovies] = useState([]);
  const [view, setView] = useState("bookmarks");
  const { searchedUser, setSearchedUser } = useSearchTerm();
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(false);

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
    setLoading(true);
    const fetchData = async () => {
      if (!data || !data.allUsers) return;
      const user = searchedUser || username;
      const bookmarkedMovies = data.allUsers.filter(
        (u) =>
          u.username === user &&
          ((view === "rated" && !isNaN(u.rating)) ||
            (view === "bookmarks" && u.rating === "[to be watched]") ||
            (view === "watched" && u.rating === "[watched]") ||
            view === "")
      );

      const moviesWithRatings = await Promise.all(
        bookmarkedMovies.map(async (u) => {
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&i=${u.movieId}&plot=full`
          );
          const details = await response.json();
          const [ratingR, ratingM] = [
            "Rotten Tomatoes",
            "Internet Movie Database",
          ].map((source) => details.Ratings.find((r) => r.Source === source));
          const userRating =
            data.allUsers.find(
              (userMovie) =>
                userMovie.movieId === u.movieId && userMovie.username === user
            )?.rating || "";
          return {
            imdbID: details.imdbID,
            Title: details.Title,
            Year: details.Year,
            Language: details.Language,
            Poster: details.Poster,
            Genre: details.Genre,
            Country: details.Country,
            ratingR,
            ratingM,
            userRating,
          };
        })
      );

      const sortByUserReviews = (a, b) => {
        const ratingA = parseFloat(
          data.allUsers.find(
            (u) => u.movieId === a.imdbID && u.username === user
          )?.rating || 0
        );
        const ratingB = parseFloat(
          data.allUsers.find(
            (u) => u.movieId === b.imdbID && u.username === user
          )?.rating || 0
        );

        if (sort) {
          return ratingB - ratingA;
        } else {
          return ratingA - ratingB;
        }
      };

      setMovies(moviesWithRatings.sort(sortByUserReviews));

      setLoading(false);
    };

    fetchData();
  }, [data, username, view, searchedUser, sort]);

  const handlepress = (m_id) => {
    setId(m_id);
    navigation.navigate("Movie_info");
  };

  const renderItem = ({ item }) => {
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
                style={{
                  color: theme[current].charcoal,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {item.Title}{" "}
              </Text>
              <Text
                style={{ fontStyle: "italic", color: theme[current].charcoal }}
              >
                [{item.Year}] [{item.Genre}] [{item.Language}][{item.Country}]
              </Text>

              <View style={{ width: "50%", flexDirection: "row" }}>
                {item.ratingR ? (
                  <View style={{ marginRight: "4%" }}>
                    <Text
                      style={{
                        fontStyle: "italic",
                        color: theme[current].charcoal,
                      }}
                    >{`Critics: ${item.ratingR.Value}`}</Text>
                    <View
                      style={{
                        width: "100%",
                        backgroundColor: theme[current],
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
                      style={{
                        fontStyle: "italic",
                        color: theme[current].charcoal,
                      }}
                    >{`IMDB: ${item.ratingM.Value}`}</Text>
                    <View
                      style={{
                        width: "100%",
                        backgroundColor: theme[current],
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

              {item.userRating &&
                item.userRating !== "[to be watched]" &&
                item.userRating !== "[watched]" && (
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
                          color: theme[current].charcoal,
                          fontSize: 20,
                          fontWeight: "500",
                        }}
                      >
                        {searchedUser
                          ? `${searchedUser}'s rating: ${parseFloat(
                              item.userRating
                            )}%`
                          : `Your rating: ${parseFloat(item.userRating)}%`}
                      </Text>

                      <View
                        style={{
                          width: "100%",
                          backgroundColor: theme[current],
                          borderRadius: 999,
                          height: 4,
                        }}
                      >
                        <View
                          style={{
                            width: parseFloat(item.userRating) + "%",
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
              {item.userRating == "[to be watched]" && (
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
              {item.userRating == "[watched]" && (
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
      <View style={{ width: "100%", alignItems: "center" }}>
        {searchedUser && (
          <View
            style={{
              flexDirection: "row",
              marginBottom: "5%",
            }}
          >
            <FontAwesome6 name="users-viewfinder" size={38} color="black" />

            <Text
              style={{
                fontSize: 24,
                borderBottomWidth: 4,
                borderColor: theme[current].orange,
                marginLeft: "3%",
              }}
            >
              {searchedUser}
            </Text>
            <Text style={{ color: theme[current].orange, fontSize: 20 }}>
              's
            </Text>
            <Text style={{ color: theme[current].orange, fontSize: 20 }}>
              {" "}
              lists
            </Text>
          </View>
        )}
      </View>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Pressable
            onPress={() => setView("bookmarks")}
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
              <Text style={{ color: theme[current].charcoal }}>Bookmarks</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setView("watched")}
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
              <Text style={{ color: theme[current].charcoal }}>Watched</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setView("rated");
              setSort(!sort);
            }}
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
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome
                  name="sort-desc"
                  size={36}
                  color={sort ? theme[current].orange : theme[current].charcoal}
                />
                <FontAwesome
                  name="sort-asc"
                  size={36}
                  color={
                    !sort ? theme[current].orange : theme[current].charcoal
                  }
                />
              </View>

              <Text style={{ color: theme[current].charcoal }}>Rated</Text>
            </View>
          </Pressable>
        </View>
        {loading && (
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
        {!loading &&
          (movies.length > 0 ? (
            <FlatList
              data={movies}
              renderItem={renderItem}
              keyExtractor={(item) => item.imdbID}
              style={{ marginBottom: 36 }}
            />
          ) : (
            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                marginTop: "20%",
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: theme[current].gray,
                }}
              >
                It's empty
              </Text>
            </View>
          ))}
      </View>
    </View>
  );
};

export default Bookmarks;
