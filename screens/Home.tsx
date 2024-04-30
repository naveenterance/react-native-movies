import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Pressable,
  Alert,
  BackHandler,
  ScrollView,
} from "react-native";
import { GET_ALL_USERS } from "../utils/graphql";
import { useQuery, QueryResult } from "@apollo/client";
import { useAuth } from "../utils/Auth";
import { theme, Theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { useFocusEffect } from "@react-navigation/native";
import List from "../components/Home_section";
import Drawer_button from "../components/Drawer_button";
import { AntDesign } from "@expo/vector-icons";
import { styles_home } from "../styles/home";
import Loader from "../components/Loader";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/RootParams";

type HomeScreenScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface User {
  movieId: string;
  username: string;
  rating: string;
  review: string;
}

interface Data {
  allUsers: User[];
}

interface HomeScreenProps {
  navigation: HomeScreenScreenNavigationProp;
  data: Data;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { error, data, refetch }: QueryResult<Data> = useQuery(GET_ALL_USERS);
  const [bookmarks, setBookmarks] = useState<User[]>([]);
  const [reviews, setReviews] = useState<User[]>([]);
  const [watched, setWatched] = useState<User[]>([]);
  const { username } = useAuth();
  const { current } = useTheme();
  const [loading, setLoading] = useState(false);
  const currentTheme = theme[current as keyof Theme];

  useFocusEffect(
    useCallback(() => {
      if (!username) {
        navigation.replace("Welcome");
      } else {
        const backHandler = BackHandler;

        const handleBeforeRemove = (e: any) => {
          e.preventDefault();

          Alert.alert(
            "Exit App",
            "Are you sure you want to exit?",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: "Exit",
                onPress: () => {
                  backHandler.exitApp();
                },
              },
            ],
            { cancelable: false }
          );
        };

        const removeListener = navigation.addListener(
          "beforeRemove",
          handleBeforeRemove
        );

        return () => {
          removeListener();
        };
      }
    }, [username, navigation])
  );

  useEffect(() => {
    setLoading(true);
    if (data && data.allUsers) {
      const userBookmarks = data.allUsers.filter(
        (item) =>
          item.username === username && item.rating === "[to be watched]"
      );
      const userReviews = data.allUsers.filter(
        (item) =>
          item.username === username &&
          item.rating != "[to be watched]" &&
          item.rating != "[watched]"
      );
      const userWatched = data.allUsers.filter(
        (item) => item.username === username && item.rating === "[watched]"
      );
      setBookmarks(userBookmarks);
      setReviews(userReviews);
      setWatched(userWatched);
      setLoading(false);
    }
  }, [data, username]);

  return (
    <View style={{ backgroundColor: currentTheme.white, height: "100%" }}>
      <Drawer_button />
      <ScrollView>
        <View
          style={{
            padding: "3%",
            marginBottom: "20%",
          }}
        >
          {bookmarks.length <= 0 &&
            reviews.length <= 0 &&
            watched.length <= 0 &&
            !loading && (
              <View
                style={{
                  width: "100%",
                  height: "90%",
                  marginTop: "30%",
                }}
              >
                <View
                  style={{
                    height: 500,
                    borderLeftWidth: 36,
                    borderColor: currentTheme.orange,
                  }}
                >
                  <View
                    style={{
                      height: 400,
                      borderLeftWidth: 36,
                      borderColor: currentTheme.blue,
                    }}
                  >
                    <View
                      style={{
                        height: 300,
                        borderLeftWidth: 36,
                        borderColor: currentTheme.gray,
                      }}
                    >
                      <Pressable
                        style={({ pressed }) => [
                          {
                            padding: "10%",
                            marginTop: "20%",
                            marginLeft: pressed ? "10%" : "1%",
                          },
                        ]}
                        onPress={() => navigation.navigate("Search")}
                      >
                        <Text
                          style={{
                            fontSize: 36,
                            fontWeight: "900",
                            color:
                              current == "dark"
                                ? currentTheme.charcoal
                                : currentTheme.gray,
                          }}
                        >
                          Its empty ,let's go add something
                        </Text>

                        <AntDesign
                          name="doubleright"
                          size={48}
                          color={currentTheme.orange}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            )}
          <Pressable onPress={() => navigation.navigate("Bookmarks")}>
            <Text
              style={[
                styles_home.Text,
                {
                  color: currentTheme.charcoal,
                  borderColor: currentTheme.orange,
                },
              ]}
            >
              Bookmarks[{bookmarks.length}]
            </Text>
          </Pressable>
          {loading && <Loader height={210} width={210} />}
          <List tab={bookmarks} />
          <Pressable onPress={() => navigation.navigate("Bookmarks")}>
            <Text
              style={[
                styles_home.Text,
                {
                  color: currentTheme.charcoal,
                  borderColor: currentTheme.orange,
                },
              ]}
            >
              Reviews[{reviews.length}]
            </Text>
          </Pressable>
          {loading && <Loader height={210} width={210} />}
          <List tab={reviews} />
          <Pressable onPress={() => navigation.navigate("Bookmarks")}>
            <Text
              style={[
                styles_home.Text,
                {
                  color: currentTheme.charcoal,
                  borderColor: currentTheme.orange,
                },
              ]}
            >
              Watched[{watched.length}]
            </Text>
          </Pressable>
          {loading && <Loader height={210} width={210} />}
          <List tab={watched} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
