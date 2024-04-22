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
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_USERS, ADD_USER } from "../utils/graphql";
import { useID } from "../utils/CurrentId";
import { useAuth } from "../utils/Auth";
import Modal_custom from "../components/Drawer";
import { useModal } from "../utils/Modal";
import RecentSearches from "../components/RecentSearches";
import { GenreFilter } from "../components/Filters";
import { LanguageFilter } from "../components/Filters";

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
  const [filterStatus, setFilterStatus] = useState(false);

  const { username } = useAuth();

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
    const shouldRenderItem = itemGenres.some((itemGenre) =>
      genre.includes(itemGenre)
    );
    const itemLanguages = item.Language.split(", ").map((language) =>
      language.trim()
    );
    const shouldRenderItem1 = itemLanguages.some((itemLanguage) =>
      language.includes(itemLanguage)
    );

    if ((shouldRenderItem || shouldRenderItem1) && !filterStatus) {
      setFilterStatus(true);
    }

    if (
      (genre.length <= 0 || shouldRenderItem) &&
      (language.length <= 0 || shouldRenderItem1)
    ) {
      return (
        <View>
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
                    [{item.Year}] [{item.Genre}] [{item.Language}]
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
        </View>
      );
    }
  };

  return (
    <>
      <View style={{ marginTop: "10%" }}>
        <Modal_custom
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        />
        <Button title="modal " onPress={() => setModalVisible(true)} />

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
        <GenreFilter setGenre={setGenre} />
        <LanguageFilter setLanguage={setLanguage} />

        {searchPerformed &&
          (movies.length === 0 ||
            (!filterStatus && (language.length > 0 || genre.length > 0))) && (
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

        <RecentSearches
          recentSearches={recentSearches}
          setRecentSearches={setRecentSearches}
          setSearchQuery={setSearchQuery}
        />
      </View>
    </>
  );
};

export default Search;
