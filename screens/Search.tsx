import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../utils/graphql";
import { useID } from "../utils/CurrentId";
import { useAuth } from "../utils/Auth";
import RecentSearches from "../components/RecentSearches";
import Drawer_button from "../components/Drawer_button";
import { theme, Theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import {
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import Filter from "../components/Filter";
import { useFocusEffect } from "@react-navigation/native";
import { styles_search } from "../styles/search";
import Loader from "../components/Loader";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/RootParams";
import { movie } from "../types/movie";
import { UserMovie } from "../types/UserMovie";

type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Search"
>;
interface SearchProps {
  navigation: SearchScreenNavigationProp;
}

const Search: React.FC<SearchProps> = ({ navigation }) => {
  const { error, data, refetch } = useQuery(GET_ALL_USERS);
  const { id, setId } = useID();
  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [genre, setGenre] = useState<string[]>([]);
  const [language, setLanguage] = useState<string[]>([]);
  const [year, setYear] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState(false);
  const current = useTheme()?.current;
  const [view, setView] = useState("recents");
  const [loading, setLoading] = useState(false);
  const { username } = useAuth();
  const currentTheme = theme[current as keyof Theme];

  useFocusEffect(
    useCallback(() => {
      if (view == "filter") {
        const handleBeforeRemove = (e: any) => {
          e.preventDefault();
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
    if (
      searchPerformed &&
      (movies.length === 0 ||
        (!filterStatus &&
          (language.length > 0 || genre.length > 0 || year.length)))
    ) {
      setLoading(false);
    }
  }, [searchPerformed, movies, filterStatus, language, genre, year]);

  const handlepress = (m_id: string) => {
    setId(m_id);
    navigation.navigate("Movie_info");
  };

  const saveRecentSearches = async (query: string) => {
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
    setLoading(true);
    setView("");
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`
      );
      const data = await response.json();
      if (data.Search) {
        const moviesWithRatings = await Promise.all(
          data.Search.map(async (movie: movie) => {
            const ratingResponse = await fetch(
              `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=full`
            );
            const details = await ratingResponse.json();

            const ratingRottenTomatoes = details.Ratings.find(
              (rating: { Source: string }) =>
                rating.Source === "Rotten Tomatoes"
            );
            const ratingIMDB = details.Ratings.find(
              (rating: { Source: string }) =>
                rating.Source === "Internet Movie Database"
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
        setLoading(false);
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

  const renderItem = ({ item }: { item: movie }) => {
    const userRating: string | null =
      data && data.allUsers
        ? data.allUsers.find(
            (userMovie: UserMovie) =>
              userMovie.movieId === item.imdbID &&
              userMovie.username === username
          )?.rating
        : null;
    const itemGenres: string[] = item.Genre.split(", ").map((genre: string) =>
      genre.trim()
    );
    const passedGenreFilter: boolean = itemGenres.some((itemGenre: string) =>
      genre.includes(itemGenre)
    );
    const itemLanguages: string[] = item.Language.split(", ").map(
      (language: string) => language.trim()
    );
    const passedLangFilter: boolean = itemLanguages.some(
      (itemLanguage: string) => language.includes(itemLanguage)
    );

    const passedYearFilter: boolean = year.some((selectedYear: string) => {
      const yearPrefix: string = selectedYear.substring(0, 3);

      const itemYearPrefix: string = item.Year.toString().substring(0, 3);

      return yearPrefix === itemYearPrefix;
    });
    if (
      (passedGenreFilter || passedLangFilter || passedYearFilter) &&
      !filterStatus
    ) {
      setFilterStatus(true);
    }

    if (
      (genre.length <= 0 || passedGenreFilter) &&
      (language.length <= 0 || passedLangFilter) &&
      (year.length <= 0 || passedYearFilter)
    ) {
      return (
        <View>
          <Pressable onPress={() => handlepress(item.imdbID)}>
            <View
              style={[
                styles_search.renderItems_container,
                {
                  borderWidth: userRating ? 4 : 0,
                  borderColor: userRating ? currentTheme.blue : "transparent",
                  backgroundColor: currentTheme.white,
                },
              ]}
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
                    fontSize: 16,
                    fontWeight: "700",
                    color: currentTheme.charcoal,
                  }}
                >
                  {item.Title}{" "}
                </Text>
                <Text
                  style={{
                    fontStyle: "italic",
                    color: currentTheme.charcoal,
                  }}
                >
                  [{item.Year}] [{item.Genre}] [{item.Language}][{item.Country}]
                </Text>

                <View style={{ width: "50%", flexDirection: "row" }}>
                  {item.ratingR ? (
                    <View style={{ marginRight: "4%" }}>
                      <Text
                        style={{
                          fontStyle: "italic",
                          color: currentTheme.charcoal,
                        }}
                      >{`Critics: ${item.ratingR.Value}`}</Text>
                      <View
                        style={[
                          styles_search.ratingsBar_container,
                          {
                            backgroundColor: currentTheme.gray,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles_search.bar,
                            {
                              width: parseFloat(item.ratingR.Value),
                              backgroundColor: currentTheme.rotten,
                            },
                          ]}
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
                          color: currentTheme.charcoal,
                        }}
                      >{`IMDB: ${item.ratingM.Value}`}</Text>
                      <View
                        style={[
                          styles_search.ratingsBar_container,
                          {
                            backgroundColor: currentTheme.gray,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles_search.bar,
                            {
                              lineHeight: 10,
                              width: `${
                                parseFloat(item.ratingM.Value.split("/")[0]) *
                                10
                              }%`,
                              color: currentTheme.gray,
                              backgroundColor: currentTheme.imdb,
                            },
                          ]}
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
                    <View style={{ width: "50%", flexDirection: "row" }}>
                      <MaterialCommunityIcons
                        name="certificate-outline"
                        size={36}
                        color={currentTheme.orange}
                      />
                      <View>
                        <Text
                          style={{
                            fontStyle: "italic",
                            fontSize: 16,
                            fontWeight: "500",
                            color: currentTheme.charcoal,
                          }}
                        >{`Your rating: ${parseFloat(userRating) + "%"}`}</Text>

                        <View
                          style={[
                            styles_search.ratingsBar_container,
                            {
                              backgroundColor: currentTheme.gray,
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles_search.bar,
                              {
                                width: `${parseFloat(userRating)}%`,
                                color: currentTheme.gray,
                                backgroundColor: currentTheme.blue,
                              },
                            ]}
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
                      color={currentTheme.green}
                    />
                    <Text
                      style={{
                        marginTop: "2%",
                        fontSize: 16,
                        fontWeight: "500",
                        color: currentTheme.green,
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
                      color={currentTheme.blue}
                    />
                    <Text
                      style={{
                        marginTop: "2%",
                        fontSize: 16,
                        fontWeight: "500",
                        color: currentTheme.blue,
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
          backgroundColor: currentTheme.white,
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
                      ? currentTheme.gray
                      : currentTheme.white,
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
                  color={currentTheme.red}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    marginLeft: "2%",
                    color: currentTheme.red,
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
                      ? currentTheme.gray
                      : currentTheme.white,
                  },
                ]}
                onPress={() => setView("")}
              >
                <MaterialCommunityIcons
                  name="filter-check-outline"
                  size={36}
                  color={currentTheme.green}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    marginLeft: "2%",
                    color: currentTheme.green,
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
                style={[
                  styles_search.searchBar,
                  {
                    color: currentTheme.charcoal,
                    borderColor: currentTheme.charcoal,
                    backgroundColor: currentTheme.white,
                  },
                ]}
                selectionColor={currentTheme.orange}
                placeholder="Search for movies..."
                placeholderTextColor={currentTheme.charcoal}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                onSubmitEditing={searchMovies}
              />

              <Pressable onPress={searchMovies} style={{ alignSelf: "center" }}>
                <FontAwesome
                  name="search"
                  size={36}
                  color={currentTheme.charcoal}
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
                    borderBottomWidth: pressed ? 4 : 0,
                    borderColor: currentTheme.orange,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    borderBottomWidth: view == "recents" ? 4 : 0,
                    borderBottomColor: currentTheme.orange,
                  }}
                >
                  <MaterialIcons
                    name="history"
                    size={30}
                    color={currentTheme.charcoal}
                  />
                  <Text style={{ color: currentTheme.charcoal }}>Recent</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setView(view == "filter" ? "" : "filter")}
                style={({ pressed }) => [
                  {
                    paddingVertical: "2%",
                    paddingHorizontal: "10%",
                    borderBottomWidth: pressed ? 4 : 0,
                    borderColor: currentTheme.orange,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderBottomWidth: view == "filter" ? 4 : 0,
                    borderBottomColor: currentTheme.orange,
                  }}
                >
                  {genre.length > 0 ||
                  language.length > 0 ||
                  year.length > 0 ? (
                    <View>
                      <AntDesign
                        name="filter"
                        size={30}
                        color={currentTheme.green}
                      />
                      <Text style={{ color: currentTheme.green }}>
                        Filtered
                      </Text>
                      <Text
                        style={{
                          fontWeight: "700",
                          color: currentTheme.green,
                        }}
                      >
                        [{genre.length}][{language.length}][
                        {year.length}]
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <AntDesign
                        name="filter"
                        size={30}
                        color={currentTheme.charcoal}
                      />
                      <Text style={{ color: currentTheme.charcoal }}>
                        Filters
                      </Text>
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
                    borderBottomWidth: pressed ? 4 : 0,
                    borderColor: currentTheme.orange,
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
                    color={currentTheme.charcoal}
                  />

                  <Text style={{ color: currentTheme.charcoal }}>
                    Watchlist{" "}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("UserSearch")}
                style={({ pressed }) => [
                  {
                    paddingVertical: "2%",
                    paddingHorizontal: "10%",
                    borderBottomWidth: pressed ? 4 : 0,
                    borderColor: currentTheme.orange,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name="person-search"
                    size={30}
                    color={currentTheme.charcoal}
                  />

                  <Text style={{ color: currentTheme.charcoal }}>
                    User Search{" "}
                  </Text>
                </View>
              </Pressable>
            </View>
            {loading && <Loader height={210} width={210} />}
            {searchPerformed &&
            searchQuery &&
            !loading &&
            (movies.length === 0 ||
              (!filterStatus &&
                (language.length > 0 || genre.length > 0 || year.length))) ? (
              <>
                <Text
                  style={{
                    alignSelf: "center",
                    marginTop: 20,
                    color: currentTheme.charcoal,
                  }}
                >
                  No results found
                </Text>
              </>
            ) : null}

            {movies.length > 0 && !view && (
              <FlatList
                data={movies}
                renderItem={renderItem}
                keyExtractor={(item) => item.imdbID}
                style={{
                  marginTop: 10,
                  marginBottom: view !== "filter" ? 210 : undefined,
                }}
              />
            )}

            {error && (
              <Text style={{ color: currentTheme.charcoal }}>
                Error: {error.message}
              </Text>
            )}
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
