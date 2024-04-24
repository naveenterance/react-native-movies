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
    <View>
      <View style={{ marginTop: "10%", marginLeft: "2%" }}>
        <Pressable onPress={() => setModalVisible(true)}>
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
            marginTop: "10%",
            padding: "3%",
            marginBottom: "20%",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "900", marginRight: "10%" }}>
            Bookmarks
          </Text>
          {bookmarks.length > 0 && (
            <View style={{ flexDirection: "row" }}>
              {bookmarks.slice(0, 2).map((bookmark, index) => (
                <Image
                  key={index}
                  style={{
                    height: 200,
                    width: "30%",
                    margin: "1%",
                  }}
                  source={{
                    uri: `http://img.omdbapi.com/?apikey=${API_KEY}&i=${bookmark["movieId"]}`,
                  }}
                />
              ))}
            </View>
          )}
          <Text
            style={{
              fontSize: 22,
              fontWeight: "900",
              marginRight: "10%",
              marginTop: "10%",
            }}
          >
            Reviews
          </Text>
          {reviews.length > 0 && (
            <View
              style={{
                flexDirection: "row",
              }}
            >
              {reviews.slice(0, 2).map((reviews, index) => (
                <Image
                  key={index}
                  style={{
                    height: 200,
                    width: "30%",
                    margin: "1%",
                  }}
                  source={{
                    uri: `http://img.omdbapi.com/?apikey=${API_KEY}&i=${reviews["movieId"]}`,
                  }}
                />
              ))}
            </View>
          )}
          <Text
            style={{
              fontSize: 22,
              fontWeight: "900",
              marginRight: "10%",
              marginTop: "10%",
            }}
          >
            Watched
          </Text>
          {watched.length > 0 && (
            <View
              style={{
                flexDirection: "row",
              }}
            >
              {watched.slice(0, 3).map((watched, index) => (
                <Image
                  key={index}
                  style={{
                    height: 200,
                    width: "30%",
                    margin: "1%",
                  }}
                  source={{
                    uri: `http://img.omdbapi.com/?apikey=${API_KEY}&i=${watched["movieId"]}`,
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modal: {
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "60%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomeScreen;
