import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { useModal } from "../utils/Modal";
import { Text, View, Pressable, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme, Theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useID } from "../utils/CurrentId";

const Modal_custom = () => {
  const { modalVisible, setModalVisible } = useModal();

  const current = useTheme()?.current;
  const { setTheme } = useTheme() || { setTheme: () => {} };
  const currentTheme = theme[current as keyof Theme];
  const route = useRoute();
  const { id, setId } = useID();
  const [isEnabled, setIsEnabled] = useState(true);

  const navigation = useNavigation();
  const toggleTheme = () => {
    setIsEnabled((previousState) => !previousState);
    !isEnabled ? setTheme("light") : setTheme("dark");
  };
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
        }}
      >
        <Modal
          isVisible={modalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          backdropColor={current == "light" ? currentTheme.gray : "#4c4c4c"}
          onBackdropPress={() => setModalVisible(false)}
          style={{ margin: 0 }}
          onBackButtonPress={() => setModalVisible(false)}
        >
          <View
            style={{
              padding: 22,
              justifyContent: "space-around",
              height: "100%",
              width: "60%",
              backgroundColor: currentTheme.white,
            }}
          >
            <Pressable style={{}} onPress={() => setModalVisible(false)}>
              <AntDesign
                name="closecircleo"
                size={35}
                color={currentTheme.red}
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                {
                  borderLeftWidth: pressed || route.name == "Home" ? 4 : 0,
                  padding: "5%",
                  borderColor: currentTheme.orange,
                },
              ]}
              onPress={() => {
                (navigation as { navigate: (screen: string) => void }).navigate(
                  "Home"
                );
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
                      ? currentTheme.orange
                      : currentTheme.charcoal
                  }
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 12,
                    color:
                      route.name == "Home"
                        ? currentTheme.orange
                        : currentTheme.charcoal,
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
                  borderColor: currentTheme.orange,
                },
              ]}
              onPress={() => {
                (navigation as { navigate: (screen: string) => void }).navigate(
                  "Search"
                );
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
                      ? currentTheme.orange
                      : currentTheme.charcoal
                  }
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 12,
                    color:
                      route.name == "Search"
                        ? currentTheme.orange
                        : currentTheme.charcoal,
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
                  borderColor: currentTheme.orange,
                },
              ]}
              onPress={() => {
                (navigation as { navigate: (screen: string) => void }).navigate(
                  "Bookmarks"
                );
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
                      ? currentTheme.orange
                      : currentTheme.charcoal
                  }
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 12,
                    color:
                      route.name == "Bookmarks"
                        ? currentTheme.orange
                        : currentTheme.charcoal,
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
                  borderColor: currentTheme.orange,
                },
              ]}
              onPress={() => {
                (navigation as { navigate: (screen: string) => void }).navigate(
                  "Profile"
                );
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
                      ? currentTheme.orange
                      : currentTheme.charcoal
                  }
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 12,
                    color:
                      route.name == "Profile"
                        ? currentTheme.orange
                        : currentTheme.charcoal,
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
                color={
                  current == "dark"
                    ? currentTheme.orange
                    : currentTheme.charcoal
                }
                style={{
                  marginTop: 12,
                  borderBottomWidth: current == "dark" ? 4 : 0,
                  borderColor: currentTheme.orange,
                }}
              />
              <Switch
                trackColor={{
                  false: currentTheme.gray,
                  true: currentTheme.gray,
                }}
                thumbColor={
                  isEnabled ? currentTheme.gray : currentTheme.charcoal
                }
                ios_backgroundColor={currentTheme.gray}
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
                color={
                  current == "light"
                    ? currentTheme.orange
                    : currentTheme.charcoal
                }
                style={{
                  marginTop: 12,
                  borderBottomWidth: current == "light" ? 4 : 0,
                  borderColor: currentTheme.orange,
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Modal_custom;
