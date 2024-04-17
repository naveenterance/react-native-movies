import Navbar from "../components/Navebar";
import React, { useState } from "react";
import {
  Button,
  TextInput,
  View,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import Search from "../components/Search";
import Movie_info from "../components/Movie_info";
import Actor_info from "../components/Actor_info";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View style={{ height: "90%" }}>
        <Actor_info />
      </View>
      <Navbar />
    </View>
  );
};

export default HomeScreen;
