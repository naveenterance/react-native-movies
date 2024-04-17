import Navbar from "../components/Navbar";
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
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const movieid = "tt2582782";
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View style={{ height: "90%" }}>
        <Search />
      </View>
      <Navbar />
    </View>
  );
};

export default HomeScreen;
