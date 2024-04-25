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
  FlatList,
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

import { genres } from "../utils/Genres";
import { languages } from "../utils/Languages";
import { years } from "../utils/Years";

const Filter = ({ genre, setGenre, language, setLanguage, year, setYear }) => {
  const [view, setView] = useState("genre");

  const renderGenre = ({ item }) => (
    <Pressable
      onPress={() => {
        if (!genre.includes(item)) {
          setGenre((prev) => [...prev, item]);
        }
      }}
    >
      <Text>{item}</Text>
    </Pressable>
  );

  const renderLanguage = ({ item }) => (
    <Pressable
      onPress={() => {
        if (!language.includes(item)) {
          setLanguage((prev) => [...prev, item]);
        }
      }}
    >
      <Text>{item}</Text>
    </Pressable>
  );

  const renderYear = ({ item }) => (
    <Pressable
      onPress={() => {
        if (!year.includes(item)) {
          setYear((prev) => [...prev, item]);
        }
      }}
    >
      <Text>{item}</Text>
    </Pressable>
  );

  return (
    <View>
      <Pressable onPress={() => setView("genre")}>
        <Text>--genre---</Text>
      </Pressable>
      <Pressable onPress={() => setView("language")}>
        <Text>--klang---</Text>
      </Pressable>
      <Pressable onPress={() => setView("year")}>
        <Text>--year---</Text>
      </Pressable>
      {view === "genre" && (
        <FlatList
          data={genres}
          renderItem={renderGenre}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {view === "language" && (
        <FlatList
          data={languages}
          renderItem={renderLanguage}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {view === "year" && (
        <FlatList
          data={years}
          renderItem={renderYear}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default Filter;
