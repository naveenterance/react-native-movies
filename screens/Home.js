import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { BackHandler, ScrollView } from "react-native";
import Modal_custom from "../components/Drawer";
import { useModal } from "../utils/Modal";
import CountryFlag from "react-native-country-flag";
import { GET_ALL_USERS } from "../utils/graphql";
import { useQuery } from "@apollo/client";
import { useAuth } from "../utils/Auth";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import List from "../components/Home_section";
import Drawer_button from "../components/Drawer_button";
import LottieView from "lottie-react-native";

const HomeScreen = ({ navigation }) => {
  const { modalVisible, setModalVisible } = useModal();
  const { error, data, refetch } = useQuery(GET_ALL_USERS);
  const [bookmarks, setBookmarks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [watched, setWatched] = useState([]);
  const { username } = useAuth();
  const { current } = useTheme();
  const [loading, setLoading] = useState(false);

  const API_KEY = "e24ea998";
  useFocusEffect(
    useCallback(() => {
      if (!username) {
        navigation.replace("Welcome");
      } else {
        const backHandler = BackHandler;

        const handleBeforeRemove = (e) => {
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
    <View style={{ backgroundColor: theme[current].white, height: "100%" }}>
      <Drawer_button />
      <ScrollView>
        <View
          style={{
            padding: "3%",
            marginBottom: "20%",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "900",
              marginRight: "10%",
              borderLeftWidth: 6,
              borderColor: theme[current].orange,
              paddingLeft: "2%",
              marginVertical: "5%",
              opacity: 0.75,
            }}
          >
            Bookmarks[{bookmarks.length}]
          </Text>
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
          <List tab={bookmarks} />
          <Text
            style={{
              fontSize: 22,
              fontWeight: "900",
              marginRight: "10%",
              borderLeftWidth: 6,
              borderColor: theme[current].orange,
              paddingLeft: "2%",
              marginVertical: "5%",
              opacity: 0.75,
            }}
          >
            Reviews[{reviews.length}]
          </Text>
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
          <List tab={reviews} />
          <Text
            style={{
              fontSize: 22,
              fontWeight: "900",
              marginRight: "10%",
              borderLeftWidth: 6,
              borderColor: theme[current].orange,
              paddingLeft: "2%",
              marginVertical: "5%",
              opacity: 0.75,
            }}
          >
            Watched[{watched.length}]
          </Text>
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
          <List tab={watched} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
