import React, { useState } from "react";
import { Text, View, Pressable, FlatList, ListRenderItem } from "react-native";
import { theme, Theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { genres } from "../utils/Genres";
import { languages } from "../utils/Languages";
import { years } from "../utils/Years";

interface FilterProps {
  genre: string[];
  setGenre: React.Dispatch<React.SetStateAction<string[]>>;
  language: string[];
  setLanguage: React.Dispatch<React.SetStateAction<string[]>>;
  year: string[];
  setYear: React.Dispatch<React.SetStateAction<string[]>>;
}

const Filter: React.FC<FilterProps> = ({
  genre,
  setGenre,
  language,
  setLanguage,
  year,
  setYear,
}) => {
  const current = useTheme()?.current;
  const currentTheme = theme[current as keyof Theme];
  const [view, setView] = useState<"genre" | "language" | "year">("genre");

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <Pressable
      onPress={() => {
        switch (view) {
          case "genre":
            setGenre((prev) =>
              prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
            );
            break;
          case "language":
            setLanguage((prev) =>
              prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
            );
            break;
          case "year":
            setYear((prev) =>
              prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
            );
            break;
          default:
            break;
        }
      }}
    >
      <View
        style={{
          margin: 12,
          borderLeftWidth:
            (view === "genre" && genre.includes(item)) ||
            (view === "language" && language.includes(item)) ||
            (view === "year" && year.includes(item))
              ? 4
              : 0,

          borderColor: currentTheme.orange,
          paddingHorizontal: 12,
        }}
      >
        <Text
          style={{
            color:
              view === "genre"
                ? genre.includes(item)
                  ? currentTheme.orange
                  : currentTheme.charcoal
                : view === "language"
                ? language.includes(item)
                  ? currentTheme.orange
                  : currentTheme.charcoal
                : year.includes(item)
                ? currentTheme.orange
                : currentTheme.charcoal,
            fontSize: 24,
          }}
        >
          {item}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ width: "60%" }}>
        <FlatList
          data={
            view === "genre" ? genres : view === "language" ? languages : years
          }
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={{ marginBottom: "90%" }}
        />
      </View>
      <View style={{ width: "40%", padding: "2%", alignItems: "flex-end" }}>
        <Pressable
          onPress={() => setView("genre")}
          style={{
            marginTop: "10%",
            borderRightWidth: view === "genre" ? 4 : 0,
            borderColor: currentTheme.blue,
            alignItems: "flex-end",
            padding: "10%",
          }}
        >
          <MaterialCommunityIcons
            name="filmstrip"
            size={48}
            color={view === "genre" ? currentTheme.blue : currentTheme.charcoal}
          />
          <Text
            style={{
              fontSize: 20,
              color:
                view === "genre" ? currentTheme.blue : currentTheme.charcoal,
            }}
          >
            Genre[{genre.length}]
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setView("language")}
          style={{
            marginTop: "10%",
            borderRightWidth: view === "language" ? 4 : 0,
            borderColor: currentTheme.blue,
            alignItems: "flex-end",
            padding: "10%",
          }}
        >
          <FontAwesome
            name="language"
            size={48}
            color={
              view === "language" ? currentTheme.blue : currentTheme.charcoal
            }
          />
          <Text
            style={{
              fontSize: 20,
              color:
                view === "language" ? currentTheme.blue : currentTheme.charcoal,
            }}
          >
            Language[{language.length}]
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setView("year")}
          style={{
            marginTop: "10%",
            borderRightWidth: view === "year" ? 4 : 0,
            borderColor: currentTheme.blue,
            alignItems: "flex-end",
            padding: "10%",
          }}
        >
          <AntDesign
            name="calendar"
            size={48}
            color={view === "year" ? currentTheme.blue : currentTheme.charcoal}
          />
          <Text
            style={{
              fontSize: 20,
              color:
                view === "year" ? currentTheme.blue : currentTheme.charcoal,
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
