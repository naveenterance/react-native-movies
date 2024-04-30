import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../utils/graphql";
import { useAuth } from "../utils/Auth";
import { useID } from "../utils/CurrentId";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
  FontAwesome6,
} from "@expo/vector-icons";
import { theme, Theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { useFocusEffect } from "@react-navigation/native";
import Drawer_button from "../components/Drawer_button";
import { useSearchTerm } from "../utils/SearchTerm";
import Loader from "../components/Loader";
import { styles_bookmarks } from "../styles/bookmarks";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/RootParams";

type BookmarksScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Bookmarks"
>;
interface BookmarksProps {
  navigation: BookmarksScreenNavigationProp;
}
interface UserMovie {
  movieId: string;
  username: string;
  rating: string;
  review: string;
}
interface movie {
  Language: string;
  Genre: string;
  Poster: string;
  Country: string;
  ratingR: {
    Value: string;
  };
  ratingM: {
    Value: string;
  };
  imdbID: string;
  Year: string;
  Title: string;
}
interface rating {
  Source: string;
  Value: string;
}

const Bookmarks: React.FC<BookmarksProps> = ({ navigation }) => {
  const { current } = useTheme();
  const { error, data, refetch } = useQuery(GET_ALL_USERS);
  const { username } = useAuth();
  const { id, setId } = useID();
  const [movies, setMovies] = useState([]);
  const [view, setView] = useState("bookmarks");
  const { searchedUser, setSearchedUser } = useSearchTerm();
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(false);
  const currentTheme = theme[current as keyof Theme];

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
        (item: UserMovie) =>
          item.username === user &&
          ((view === "rated" && !isNaN(item.rating)) ||
            (view === "bookmarks" && item.rating === "[to be watched]") ||
            (view === "watched" && item.rating === "[watched]") ||
            view === "")
      );

      const moviesWithRatings = await Promise.all(
        bookmarkedMovies.map(async (item: any) => {
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&i=${item.movieId}&plot=full`
          );
          const details = await response.json();
          const [ratingR, ratingM] = [
            "Rotten Tomatoes",
            "Internet Movie Database",
          ].map((source) =>
            details.Ratings.find((r: rating) => r.Source === source)
          );
          const userRating =
            data.allUsers.find(
              (userMovie: any) =>
                userMovie.movieId === item.movieId &&
                userMovie.username === user
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

      const sortByUserReviews = (a: movie, b: movie) => {
        const ratingA = parseFloat(
          data.allUsers.find(
            (item: UserMovie) =>
              item.movieId === a.imdbID && item.username === user
          )?.rating || 0
        );
        const ratingB = parseFloat(
          data.allUsers.find(
            (item: UserMovie) =>
              item.movieId === b.imdbID && item.username === user
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

  const handlepress = (m_id: string) => {
    setId(m_id);
    navigation.navigate("Movie_info");
  };

  const renderItem = ({ item }: any) => {
    return (
      <View>
        <Pressable onPress={() => handlepress(item.imdbID)}>
          <View
            style={[
              styles_bookmarks.renderItems_container,
              {
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
                style={{ fontStyle: "italic", color: currentTheme.charcoal }}
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
                        styles_bookmarks.ratingBar_container,
                        {
                          backgroundColor: currentTheme.gray,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles_bookmarks.bar,
                          {
                            backgroundColor: currentTheme.rotten,
                            width: item.ratingR.Value,
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
                        styles_bookmarks.ratingBar_container,
                        {
                          backgroundColor: currentTheme.gray,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles_bookmarks.bar,
                          {
                            backgroundColor: currentTheme.imdb,
                            width: `${
                              parseFloat(item.ratingM.Value.split("/")[0]) * 10
                            }%`,
                          },
                        ]}
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
                      >
                        {searchedUser
                          ? `${searchedUser}'s rating: ${parseFloat(
                              item.userRating
                            )}%`
                          : `Your rating: ${parseFloat(item.userRating)}%`}
                      </Text>

                      <View
                        style={[
                          styles_bookmarks.ratingBar_container,
                          {
                            backgroundColor: currentTheme.gray,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles_bookmarks.bar,
                            {
                              width: `${parseFloat(item.userRating)}%`,
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
              {item.userRating == "[to be watched]" && (
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
              {item.userRating == "[watched]" && (
                <View style={{ flexDirection: "row", margin: "1%" }}>
                  <AntDesign name="eyeo" size={36} color={currentTheme.blue} />
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
  };

  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        paddingBottom: 110,
        backgroundColor: currentTheme.white,
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
            <FontAwesome6
              name="users-viewfinder"
              size={38}
              color={currentTheme.charcoal}
            />

            <Text
              style={{
                fontSize: 24,
                borderBottomWidth: 4,
                marginLeft: "3%",
                borderColor: currentTheme.orange,
                color: currentTheme.charcoal,
              }}
            >
              {searchedUser}
            </Text>
            <Text style={{ color: currentTheme.orange, fontSize: 20 }}>'s</Text>
            <Text style={{ color: currentTheme.orange, fontSize: 20 }}>
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
                  ? currentTheme.gray
                  : currentTheme.white,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                borderBottomWidth: view == "bookmarks" ? 4 : 0,
                borderBottomColor: currentTheme.orange,
              }}
            >
              <MaterialCommunityIcons
                name="bookmark-multiple-outline"
                size={30}
                color={currentTheme.charcoal}
              />
              <Text style={{ color: currentTheme.charcoal }}>Bookmarks</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setView("watched")}
            style={({ pressed }) => [
              {
                paddingVertical: "2%",
                paddingHorizontal: "5%",
                backgroundColor: pressed
                  ? currentTheme.gray
                  : currentTheme.white,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                borderBottomWidth: view == "watched" ? 4 : 0,
                borderBottomColor: currentTheme.orange,
              }}
            >
              <AntDesign name="eyeo" size={30} color={currentTheme.charcoal} />
              <Text style={{ color: currentTheme.charcoal }}>Watched</Text>
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
                  ? currentTheme.gray
                  : currentTheme.white,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                borderBottomWidth: view == "rated" ? 4 : 0,
                borderBottomColor: currentTheme.orange,
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
                  color={sort ? currentTheme.orange : currentTheme.charcoal}
                />
                <FontAwesome
                  name="sort-asc"
                  size={36}
                  color={!sort ? currentTheme.orange : currentTheme.charcoal}
                />
              </View>

              <Text style={{ color: currentTheme.charcoal }}>Rated</Text>
            </View>
          </Pressable>
        </View>
        {loading && <Loader width={210} height={210} />}
        {!loading &&
          (movies.length > 0 ? (
            <FlatList
              data={movies}
              renderItem={renderItem}
              keyExtractor={(item: movie) => item.imdbID}
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
                  fontWeight: "600",
                  color: currentTheme.gray,
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
