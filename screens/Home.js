import React, { useState, useRef } from "react";
import { View, Pressable, Animated } from "react-native";
import Search from "../components/Search";
import Profile from "../components/Profile";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [view, setView] = useState("Search");
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const switchView = (newView) => {
    fadeOut();
    setTimeout(() => {
      setView(newView);
      fadeIn();
    }, 500);
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {view === "Search" && <Search />}
        {view === "Profile" && <Profile />}
      </Animated.View>
      <View
        style={{
          height: 50,
          backgroundColor: "#E5E7EB",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Pressable onPress={() => switchView("")}>
          <AntDesign name="home" size={30} color="black" />
        </Pressable>
        <Pressable onPress={() => switchView("Search")}>
          <AntDesign name="search1" size={30} color="black" />
        </Pressable>
        <Pressable onPress={() => switchView("")}>
          <Feather name="bookmark" size={30} color="black" />
        </Pressable>
        <Pressable onPress={() => switchView("Profile")}>
          <FontAwesome name="user-circle-o" size={30} color="black" />
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;
