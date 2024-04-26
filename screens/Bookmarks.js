import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
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
import Filter from "../components/Filter";

const Bookmarks = ({ navigation }) => {
  const { current } = useTheme();
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const { username } = useAuth();
  const { id, setId } = useID();
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState([]);
  const [language, setLanguage] = useState([]);
  const [year, setYear] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [view, setView] = useState("");

  const API_KEY = "e24ea998";

  useFocusEffect(
    useCallback(() => {
      if (view) {
        const handleBeforeRemove = (event) => {
          event.preventDefault();
          setView("");
          navigation.removeListener("beforeRemove", handleBeforeRemove);
        };
        navigation.addListener("beforeRemove", handleBeforeRemove);
        return () =>
          navigation.removeListener("beforeRemove", handleBeforeRemove);
      }
    }, [view, navigation])
  );

  useEffect(() => {
    const fetchData = async () => {
      if (data && data.allUsers) {
        const bookmarkedMovies = data.allUsers.filter(
          (user) =>
            user.username === username && user.rating === "[to be watched]"
        );

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
  }, [data, username]);

  const handlepress = (m_id) => {
    setId(m_id);
    navigation.navigate("Movie_info");
  };

  useEffect(() => {
    let filteredMovies = movies;

    if (genre.length > 0) {
      filteredMovies = filteredMovies.filter((movie) =>
        genre.some((word) => movie.Genre.includes(word))
      );
    }

    if (language.length > 0) {
      filteredMovies = filteredMovies.filter((movie) =>
        language.some((word) => movie.Language.includes(word))
      );
    }

    if (searchQuery) {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (year.length > 0) {
      filteredMovies = filteredMovies.filter((movie) =>
        year.some((word) => movie.Year.substring(0, 3) == word.substring(0, 3))
      );
    }

    setFiltered(filteredMovies);
  }, [genre, language, year, searchQuery]);

  const renderItem = ({ item }) => {
    const userRating =
      data && data.allUsers
        ? data.allUsers.find(
            (userMovie) =>
              userMovie.movieId === item.imdbID &&
              userMovie.username === username
          )?.rating
        : null;
    const itemGenres = item.Genre.split(", ").map((genre) => genre.trim());
    const passedgenrefilter = itemGenres.some((itemGenre) =>
      genre.includes(itemGenre)
    );
    // const passedgenrefilter = genre.every((genreItem) =>
    //   itemGenres.includes(genreItem)
    // );

    const itemLanguages = item.Language.split(", ").map((language) =>
      language.trim()
    );
    const passedlangfilter = itemLanguages.some((itemLanguage) =>
      language.includes(itemLanguage)
    );

    //     const passedlangfilter = language.every((langItem) =>
    //   itemLanguages.some((itemLang) => itemLang.includes(langItem))
    // );

    const passedyearfilter = year.some((year) => {
      const yearPrefix = year.substring(0, 3);

      const itemYearPrefix = item.Year.toString().substring(0, 3);

      return yearPrefix === itemYearPrefix;
    });

    if (
      (genre.length <= 0 || passedgenrefilter) &&
      (language.length <= 0 || passedlangfilter) &&
      (year.length <= 0 || passedyearfilter)
    ) {
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
                borderWidth: userRating && 4,
                borderColor: userRating && theme[current].blue,
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
                    <View style={{ width: "50%" }}>
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
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme[current].white,
      }}
    >
      <Drawer_button />
      <TextInput
        style={{
          backgroundColor: theme[current].white,
          width: "80%",

          marginTop: "1%",
          paddingHorizontal: "5%",
          paddingVertical: "2%",
          borderWidth: 2,
          borderColor: theme[current].charcoal,
          borderRadius: 999,
          fontSize: 16,
          marginHorizontal: "2%",
        }}
        selectionColor={theme[current].orange}
        placeholder="Search for movies..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      {view == "filter" ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Pressable
              style={({ pressed }) => [
                {
                  borderBottomWidth: pressed ? 6 : 0,
                  padding: "5%",
                  borderColor: theme[current].orange,
                  flexDirection: "row",
                  backgroundColor: pressed
                    ? theme[current].gray
                    : theme[current].white,
                },
              ]}
              onPress={() => {
                setGenre([]);
                setLanguage([]);
                setYear([]);
              }}
            >
              <MaterialCommunityIcons
                name="filter-remove-outline"
                size={36}
                color={theme[current].red}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  marginLeft: "2%",
                  color: theme[current].red,
                }}
              >
                Clear
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                {
                  borderBottomWidth: pressed ? 6 : 0,
                  padding: "5%",
                  borderColor: theme[current].orange,
                  flexDirection: "row",
                  backgroundColor: pressed
                    ? theme[current].gray
                    : theme[current].white,
                },
              ]}
              onPress={() => setView("")}
            >
              <MaterialCommunityIcons
                name="filter-check-outline"
                size={36}
                color={theme[current].green}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  marginLeft: "2%",
                  color: theme[current].green,
                }}
              >
                Done
              </Text>
            </Pressable>
          </View>

          <Filter
            genre={genre}
            setGenre={setGenre}
            language={language}
            setLanguage={setLanguage}
            year={year}
            setYear={setYear}
          />
        </View>
      ) : (
        <View>
          <Pressable
            onPress={() => setView(view == "filter" ? "" : "filter")}
            style={({ pressed }) => [
              {
                paddingVertical: "2%",
                paddingHorizontal: "10%",
                backgroundColor: pressed
                  ? theme[current].gray
                  : theme[current].white,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                borderBottomWidth: view == "filter" ? 4 : 0,
                borderBottomColor: theme[current].orange,
              }}
            >
              {genre.length > 0 || language.length > 0 || year.length > 0 ? (
                <View>
                  <AntDesign
                    name="filter"
                    size={28}
                    color={theme[current].green}
                  />
                  <Text style={{ color: theme[current].green }}>Filtered</Text>
                  <Text
                    style={{
                      fontWeight: "700",
                      color: theme[current].green,
                    }}
                  >
                    [{genre.length}][{language.length}][
                    {year.length}]
                  </Text>
                </View>
              ) : (
                <View>
                  <AntDesign name="filter" size={28} color="black" />
                  <Text>Filters</Text>
                </View>
              )}
            </View>
          </Pressable>
          <Text style={styles.title}>Bookmarked Movies</Text>
          <FlatList
            data={filtered.length <= 0 ? movies : filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item.imdbID}
            style={{ marginBottom: 36 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    margin: 8,
    backgroundColor: "#E5E7EB",
    padding: 8,
    borderRadius: 8,
  },
  ratingBar: {
    width: "100%",
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    height: 4,
    marginTop: 4,
  },
  ratingBarFill: {
    alignItems: "center",
    padding: 2,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "500",
    color: "#4299E1",
    textAlign: "center",
    lineHeight: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default Bookmarks;
