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

const Modal_custom = () => {
  const { modalVisible, setModalVisible } = useModal();
  const { current, setTheme } = useTheme();
  const route = useRoute();
  // console.log(route.name);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const navigation = useNavigation();
  const toggleTheme = () => {
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
          backdropColor="black"
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
                  borderLeftWidth: pressed ? 4 : 0,
                  padding: "5%",
                  borderColor: theme[current].orange,
                },
              ]}
              onPress={() => {
                navigation.navigate("Home");
                setModalVisible(false);
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
                  borderLeftWidth: pressed ? 4 : 0,
                  padding: "5%",
                  borderColor: theme[current].orange,
                },
              ]}
              onPress={() => {
                navigation.navigate("Search");
                setModalVisible(false);
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
                  borderLeftWidth: pressed ? 4 : 0,
                  padding: "5%",
                  borderColor: theme[current].orange,
                },
              ]}
              onPress={() => {
                navigation.navigate("Bookmarks");
                setModalVisible(false);
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="bookmark-multiple-outline"
                  size={30}
                  color={theme[current].charcoal}
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 12,
                    color: theme[current].charcoal,
                  }}
                >
                  Bookmarks
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  borderLeftWidth: pressed ? 4 : 0,
                  padding: "5%",
                  borderColor: theme[current].orange,
                },
              ]}
              onPress={() => {
                navigation.navigate("Profile");
                setModalVisible(false);
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
            <Pressable
              onPress={toggleTheme}
              style={{
                marginTop: 20,
                padding: 10,
                backgroundColor: theme[current].text,
              }}
            >
              <Text style={{ color: "#ffffff" }}>Toggle Theme</Text>
            </Pressable>
            <View style={{ flexDirection: "row" }}>
              <Feather
                name="moon"
                size={24}
                color="black"
                style={{ marginTop: 12 }}
              />
              <Switch
                trackColor={{ false: "white", true: "gray" }}
                thumbColor={isEnabled ? "black" : "white"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{
                  transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }],
                  marginHorizontal: 12,
                }}
              />
              <Feather
                name="sun"
                size={24}
                color="black"
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
