import React, { useState, useEffect, useCallback } from "react";
import { Text, View, Button, StyleSheet, Pressable, Alert } from "react-native";
import { BackHandler } from "react-native";
import Modal_custom from "../components/Drawer";
import { useModal } from "../utils/Modal";
import CountryFlag from "react-native-country-flag";
import { GET_ALL_USERS } from "../utils/graphql";
import { useQuery } from "@apollo/client";
import { useAuth } from "../utils/Auth";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const { modalVisible, setModalVisible } = useModal();
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const [bookmarks, setBookmarks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { username } = useAuth();
  const { current } = useTheme();
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
        (user) =>
          user.username === username && user.rating === "[to be watched]"
      );
      const userReviews = data.allUsers.filter(
        (user) => user.username === username && user.rating != "[to be watched]"
      );
      setBookmarks(userBookmarks);
      setReviews(userReviews);
    }
  }, [data, username]);

  return (
    <View>
      <View>
        <Modal_custom
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        />

        <Button title="modal " onPress={() => setModalVisible(true)} />

        <View
          style={{
            height: 50,
            backgroundColor: "#E5E7EB",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <CountryFlag isoCode="AX" size={25} />
          <Text style={{ color: theme[current].text }}>Takumi</Text>
          <Button
            title="Profile"
            onPress={() => navigation.navigate("Profile")}
          />
          <Button
            title="Search"
            onPress={() => navigation.navigate("Search")}
          />

          <Text>{bookmarks.length}</Text>
          <Text>{reviews.length}</Text>
        </View>
      </View>
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
