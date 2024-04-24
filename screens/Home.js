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

const HomeScreen = ({ navigation }) => {
  const { modalVisible, setModalVisible } = useModal();
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const [bookmarks, setBookmarks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [watched, setWatched] = useState([]);
  const { username } = useAuth();
  const { current } = useTheme();
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
    }
  }, [data, username]);

  return (
    <View style={{ backgroundColor: theme[current].white }}>
      <View style={{ marginTop: "10%", marginLeft: "2%" }}>
        <Pressable
          style={({ pressed }) => [
            {
              borderLeftWidth: pressed ? 4 : 0,
              padding: "2%",
              borderColor: theme[current].orange,
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="menu" size={36} color="black" />
        </Pressable>
      </View>

      <Modal_custom
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />
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
          <List tab={watched} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
