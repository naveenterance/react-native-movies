import React, { useState, useEffect } from "react";

import Modal from "react-native-modal";
import { useModal } from "../utils/Modal";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Pressable,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useID } from "../utils/CurrentId";

const Modal_custom = () => {
  const { modalVisible, setModalVisible } = useModal();
  const { current, setTheme } = useTheme();
  const route = useRoute();
  const { id, setId } = useID();
  const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const navigation = useNavigation();
  const toggleTheme = () => {
    setIsEnabled((previousState) => !previousState);
    const newTheme = current === "light" ? "dark" : "light";
    setTheme(newTheme);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.centeredView}>
        <Modal
          isVisible={modalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          backdropColor={current == "light" ? theme[current].gray : "#4c4c4c"}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.modal}
          onBackButtonPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme[current].white },
            ]}
          >
            <Pressable style={{}} onPress={() => setModalVisible(false)}>
              <AntDesign
                name="closecircleo"
                size={35}
                color={theme[current].red}
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                {
                  borderLeftWidth: pressed || route.name == "Home" ? 4 : 0,
                  padding: "5%",
                  borderColor: theme[current].orange,
                },
              ]}
              onPress={() => {
                navigation.navigate("Home");
                setModalVisible(false);
                setId("");
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                }}
              >
                <AntDesign
                  name="home"
                  size={30}
                  color={
                    route.name == "Home"
                      ? theme[current].orange
                      : theme[current].charcoal
                  }
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 12,
                    color:
                      route.name == "Home"
                        ? theme[current].orange
                        : theme[current].charcoal,
                  }}
                >
                  Home
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  borderLeftWidth: pressed || route.name == "Search" ? 4 : 0,
                  padding: "5%",
                  borderColor: theme[current].orange,
                },
              ]}
              onPress={() => {
                navigation.navigate("Search");
                setModalVisible(false);
                setId("");
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="movie-search-outline"
                  size={30}
                  color={
                    route.name == "Search"
                      ? theme[current].orange
                      : theme[current].charcoal
                  }
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 12,
                    color:
                      route.name == "Search"
                        ? theme[current].orange
                        : theme[current].charcoal,
                  }}
                >
                  Search
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                {
                  borderLeftWidth: pressed || route.name == "Bookmarks" ? 4 : 0,
                  padding: "5%",
                  borderColor: theme[current].orange,
                },
              ]}
              onPress={() => {
                navigation.navigate("Bookmarks");
                setModalVisible(false);
                setId("");
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="bookmark-multiple-outline"
                  size={30}
                  color={
                    route.name == "Bookmarks"
                      ? theme[current].orange
                      : theme[current].charcoal
                  }
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 12,
                    color:
                      route.name == "Bookmarks"
                        ? theme[current].orange
                        : theme[current].charcoal,
                  }}
                >
                  Bookmarks
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  borderLeftWidth: pressed || route.name == "Profile" ? 4 : 0,
                  padding: "5%",
                  borderColor: theme[current].orange,
                },
              ]}
              onPress={() => {
                navigation.navigate("Profile");
                setModalVisible(false);
                setId("");
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <FontAwesome
                  name="user-circle-o"
                  size={30}
                  color={
                    route.name == "Profile"
                      ? theme[current].orange
                      : theme[current].charcoal
                  }
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 12,
                    color:
                      route.name == "Profile"
                        ? theme[current].orange
                        : theme[current].charcoal,
                  }}
                >
                  Profile
                </Text>
              </View>
            </Pressable>

            <View style={{ flexDirection: "row" }}>
              <Feather
                name="moon"
                size={24}
                color={theme[current].charcoal}
                style={{ marginTop: 12 }}
              />
              <Switch
                trackColor={{
                  false: theme[current].gray,
                  true: theme[current].gray,
                }}
                thumbColor={
                  isEnabled ? theme[current].gray : theme[current].charcoal
                }
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleTheme}
                value={isEnabled}
                style={{
                  transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }],
                  marginHorizontal: 12,
                }}
              />
              <Feather
                name="sun"
                size={24}
                color={theme[current].charcoal}
                style={{ marginTop: 12 }}
              />
            </View>
          </View>
        </Modal>
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
    padding: 22,
    justifyContent: "space-around",
    // alignItems: "end",
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
export default Modal_custom;
