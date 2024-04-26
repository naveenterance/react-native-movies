import React, { useState, useEffect, useCallback } from "react";
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
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_USERS, ADD_USER } from "../utils/graphql";
import { useID } from "../utils/CurrentId";
import { useAuth } from "../utils/Auth";
import Modal_custom from "../components/Drawer";
import { useModal } from "../utils/Modal";
import RecentSearches from "../components/RecentSearches";

import { LanguageFilter } from "../components/ssss";
import { YearFilter } from "../components/ssss";
import Drawer_button from "../components/Drawer_button";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
// import { ScrollView } from "react-native-gesture-handler";
import Filter from "../components/Filter";
import { BackHandler, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const Search = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const [addUser] = useMutation(ADD_USER);
  const { id, setId } = useID();
  const { modalVisible, setModalVisible } = useModal();
  const API_KEY = "e24ea998";
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [genre, setGenre] = useState([]);
  const [language, setLanguage] = useState([]);
  const [year, setYear] = useState([]);
  const [filterStatus, setFilterStatus] = useState(false);
  const { current } = useTheme();
  const [view, setView] = useState("recents");

  const { username } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (view == "filter") {
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

  const handlepress = (m_id) => {
    setId(m_id);
    navigation.navigate("Movie_info");
  };

  const saveRecentSearches = async (query) => {
    try {
      const searches = recentSearches.filter(
        (search, index) => index < 5 && search !== query
      );
      const updatedSearches = [query, ...searches];
      await AsyncStorage.setItem(
        `recentSearches_${username}`,
        JSON.stringify(updatedSearches)
      );
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };

  const searchMovies = async () => {
    setView("");
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
            const details = await ratingResponse.json();

            const ratingRottenTomatoes = details.Ratings.find(
              (rating) => rating.Source === "Rotten Tomatoes"
            );
            const ratingIMDB = details.Ratings.find(
              (rating) => rating.Source === "Internet Movie Database"
            );

            return {
              ...movie,
              Language: details.Language,
              Genre: details.Genre,
              Poster: details.Poster,
              Country: details.Country,
              ratingR: ratingRottenTomatoes,
              ratingM: ratingIMDB,
            };
          })
        );
        setMovies(moviesWithRatings);
        saveRecentSearches(searchQuery);
        setSearchPerformed(true);
      } else {
        setMovies([]);
        setSearchPerformed(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setFilterStatus(false);
  }, [searchQuery, genre]);

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
    const itemLanguages = item.Language.split(", ").map((language) =>
      language.trim()
    );
    const passedlangfilter = itemLanguages.some((itemLanguage) =>
      language.includes(itemLanguage)
    );

    const passedyearfilter = year.some((year) => {
      const yearPrefix = year.substring(0, 3);

      const itemYearPrefix = item.Year.toString().substring(0, 3);

      return yearPrefix === itemYearPrefix;
    });
    if (
      (passedgenrefilter || passedlangfilter || passedyearfilter) &&
      !filterStatus
    ) {
      setFilterStatus(true);
    }

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

  return (
    <>
      <View
        style={{
          backgroundColor: theme[current].white,
          height: "100%",
        }}
      >
        <Drawer_button />
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
                    padding: "5%",
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
                    padding: "5%",
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
          <View style={{ marginTop: "1%" }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
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
                onSubmitEditing={searchMovies}
              />
              <Pressable onPress={searchMovies} style={{ alignSelf: "center" }}>
                <FontAwesome
                  name="search"
                  size={36}
                  color={theme[current].charcoal}
                />
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: "5%",
              }}
            >
              <Pressable
                onPress={() => setView(view == "recents" ? "" : "recents")}
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
                    flexDirection: "column",
                    alignItems: "center",
                    borderBottomWidth: view == "recents" ? 4 : 0,
                    borderBottomColor: theme[current].orange,
                  }}
                >
                  <MaterialIcons name="history" size={30} color="black" />
                  <Text>Recent</Text>
                </View>
              </Pressable>

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
                  {genre.length > 0 ||
                  language.length > 0 ||
                  year.length > 0 ? (
                    <View>
                      <AntDesign
                        name="filter"
                        size={30}
                        color={theme[current].green}
                      />
                      <Text style={{ color: theme[current].green }}>
                        Filtered
                      </Text>
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
                      <AntDesign name="filter" size={30} color="black" />
                      <Text>Filters</Text>
                    </View>
                  )}
                </View>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("Bookmarks")}
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
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="bookmark-multiple-outline"
                    size={30}
                    color="black"
                  />

                  <Text>Watchlist </Text>
                </View>
              </Pressable>
            </View>
            {searchPerformed ? (
              movies.length === 0 ||
              (!filterStatus &&
                (language.length > 0 || genre.length > 0 || year.length)) ? (
                <Text style={{ alignSelf: "center", marginTop: 20 }}>
                  No results found
                </Text>
              ) : null
            ) : null}
            {movies.length > 0 && !view && (
              <FlatList
                data={movies}
                renderItem={renderItem}
                keyExtractor={(item) => item.imdbID}
                style={{
                  marginTop: 10,
                  marginBottom: view !== "filter" && 210,
                }}
              />
            )}
            {loading && <Text>Loading...</Text>}
            {error && <Text>Error: {error.message}</Text>}
            {view == "recents" && (
              <RecentSearches
                recentSearches={recentSearches}
                setRecentSearches={setRecentSearches}
                setSearchQuery={setSearchQuery}
              />
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default Search;
