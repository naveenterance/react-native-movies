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
  const { current } = useTheme();
  const [view, setView] = useState("genre");
  const renderGenre = ({ item }) => (
    <Pressable
      onPress={() => {
        setGenre((prev) => {
          if (prev.includes(item)) {
            return prev.filter((i) => i !== item);
          } else {
            return [...prev, item];
          }
        });
      }}
    >
      <View
        style={{
          margin: 12,
          borderLeftWidth: genre.includes(item) ? 4 : 0,
          borderColor: theme[current].orange,
          paddingHorizontal: 12,
        }}
      >
        <Text
          style={{
            color: genre.includes(item)
              ? theme[current].orange
              : theme[current].charcoal,
            fontSize: 24,
          }}
        >
          {item}
        </Text>
      </View>
    </Pressable>
  );

  const renderLanguage = ({ item }) => (
    <Pressable
      onPress={() => {
        setLanguage((prev) => {
          if (prev.includes(item)) {
            return prev.filter((i) => i !== item);
          } else {
            return [...prev, item];
          }
        });
      }}
    >
      <View
        style={{
          margin: 12,
          borderLeftWidth: language.includes(item) ? 4 : 0,
          borderColor: theme[current].orange,
          paddingHorizontal: 12,
        }}
      >
        <Text
          style={{
            color: language.includes(item)
              ? theme[current].orange
              : theme[current].charcoal,
            fontSize: 24,
          }}
        >
          {item}
        </Text>
      </View>
    </Pressable>
  );

  const renderYear = ({ item }) => (
    <Pressable
      onPress={() => {
        setYear((prev) => {
          if (prev.includes(item)) {
            return prev.filter((i) => i !== item);
          } else {
            return [...prev, item];
          }
        });
      }}
    >
      <View
        style={{
          margin: 12,
          borderLeftWidth: year.includes(item) ? 4 : 0,
          borderColor: theme[current].orange,
          paddingHorizontal: 12,
        }}
      >
        <Text
          style={{
            color: year.includes(item)
              ? theme[current].orange
              : theme[current].charcoal,
            fontSize: 24,
          }}
        >
          {item}'s
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View style={{ width: "60%" }}>
        {view === "genre" && (
          <FlatList
            data={genres}
            renderItem={renderGenre}
            keyExtractor={(item, index) => index.toString()}
            style={{ marginBottom: "90%" }}
          />
        )}
        {view === "language" && (
          <FlatList
            data={languages}
            renderItem={renderLanguage}
            keyExtractor={(item, index) => index.toString()}
            style={{ marginBottom: "90%" }}
          />
        )}
        {view === "year" && (
          <FlatList
            data={years}
            renderItem={renderYear}
            keyExtractor={(item, index) => index.toString()}
            style={{ marginBottom: "90%" }}
          />
        )}
      </View>
      <View
        style={{
          width: "40%",
          padding: "2%",
          alignItems: "flex-end",
        }}
      >
        <Pressable
          onPress={() => setView("genre")}
          style={{
            marginTop: "10%",
            borderRightWidth: view == "genre" ? 4 : 0,
            borderColor: theme[current].blue,
            alignItems: "flex-end",
            padding: "10%",
          }}
        >
          <MaterialCommunityIcons
            name="filmstrip"
            size={48}
            color={
              view == "genre" ? theme[current].blue : theme[current].charcoal
            }
          />
          <Text
            style={{
              fontSize: 20,
              color:
                view == "genre" ? theme[current].blue : theme[current].charcoal,
            }}
          >
            Genre[{genre.length}]
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setView("language")}
          style={{
            marginTop: "10%",
            borderRightWidth: view == "language" ? 4 : 0,
            borderColor: theme[current].blue,
            alignItems: "flex-end",
            padding: "10%",
          }}
        >
          <FontAwesome
            name="language"
            size={48}
            color={
              view == "language" ? theme[current].blue : theme[current].charcoal
            }
          />
          <Text
            style={{
              fontSize: 20,
              color:
                view == "language"
                  ? theme[current].blue
                  : theme[current].charcoal,
            }}
          >
            Language[{language.length}]
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setView("year")}
          style={{
            marginTop: "10%",
            borderRightWidth: view == "year" ? 4 : 0,
            borderColor: theme[current].blue,
            alignItems: "flex-end",
            padding: "10%",
          }}
        >
          <AntDesign
            name="calendar"
            size={48}
            color={
              view == "year" ? theme[current].blue : theme[current].charcoal
            }
          />
          <Text
            style={{
              fontSize: 20,
              color:
                view == "yaer" ? theme[current].blue : theme[current].charcoal,
            }}
          >
            Year[{year.length}]
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Filter;
