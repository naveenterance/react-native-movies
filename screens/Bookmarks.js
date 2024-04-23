import React, { useState, useEffect } from "react";
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
import { GenreFilter } from "../components/Filters";
import { LanguageFilter } from "../components/Filters";
import { YearFilter } from "../components/Filters";

const Bookmarks = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const { username } = useAuth();
  const { id, setId } = useID();
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState([]);
  const [language, setLanguage] = useState([]);
  const [year, setYear] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const API_KEY = "e24ea998";

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
              Genre: details.Genre,
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

  const handlePress = (m_id) => {
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

    return (
      <Pressable onPress={() => handlePress(item.imdbID)}>
        <View style={styles.item}>
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
                <View style={styles.ratingBar}>
                  <View
                    style={{
                      width: item.ratingR.Value,
                      backgroundColor: "#ED8936",
                      ...styles.ratingBarFill,
                    }}
                  />
                </View>
                <Text
                  style={{ fontStyle: "italic", color: "#4B5563" }}
                >{`IMDB: ${item.ratingM.Value}`}</Text>
                <View style={styles.ratingBar}>
                  <View
                    style={{
                      width: `${
                        parseFloat(item.ratingM.Value.split("/")[0]) * 10
                      }%`,
                      backgroundColor: "#ED8936",
                      ...styles.ratingBarFill,
                    }}
                  />
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
                <View style={styles.ratingBar}>
                  <View
                    style={{
                      width: `${parseFloat(userRating)}%`,
                      backgroundColor: "#4A5568",
                      ...styles.ratingBarFill,
                    }}
                  />
                </View>
              </View>
            ) : (
              <Text>Not rated yet</Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        onChangeText={(text) => setSearchQuery(text)}
      />
      <GenreFilter setGenre={setGenre} />
      <LanguageFilter setLanguage={setLanguage} />
      <YearFilter setYear={setYear} />
      <Text style={styles.title}>Bookmarked Movies</Text>
      <FlatList
        data={filtered.length <= 0 ? movies : filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.imdbID}
        style={{ marginBottom: 36 }}
      />
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
