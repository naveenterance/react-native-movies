import React, { useState, useRef, useEffect } from "react";
import { View, Pressable, Animated, Text, Button } from "react-native";
import Search from "./Search";
import Profile from "./Profile";

import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, marginTop: "20%" }}>
      <View
        style={{
          height: 50,
          backgroundColor: "#E5E7EB",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Text>Takumi</Text>
        <Button
          title="Profile"
          onPress={() => navigation.navigate("Profile")}
        />
        <Button title="Search" onPress={() => navigation.navigate("Search")} />
      </View>
    </View>
  );
};

export default HomeScreen;
