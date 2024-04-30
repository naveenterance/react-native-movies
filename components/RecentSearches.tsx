import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../utils/Auth";
import { Feather } from "@expo/vector-icons";
import { theme, Theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";

interface RecentSearchesProps {
  recentSearches: string[];
  setRecentSearches: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  recentSearches,
  setRecentSearches,
  setSearchQuery,
}) => {
  const { username } = useAuth();
  const current = useTheme()?.current;
  const currentTheme = theme[current as keyof Theme];
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const searches = await AsyncStorage.getItem(
          `recentSearches_${username}`
        );
        if (searches) {
          setRecentSearches(JSON.parse(searches));
        }
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    };

    loadRecentSearches();
  }, [username]);

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem(`recentSearches_${username}`);
      setRecentSearches([]);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  return (
    <View style={{ marginTop: "5%", marginHorizontal: "5%" }}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: "70%",
            height: "1%",
            backgroundColor: currentTheme.orange,
            alignItems: "center",
            marginTop: "2%",
            padding: 2,
            marginHorizontal: "2%",
          }}
        ></View>
        <Pressable
          onPress={clearRecentSearches}
          style={({ pressed }) => [
            {
              flexDirection: "row",

              padding: "2%",

              backgroundColor: pressed ? currentTheme.gray : currentTheme.white,
            },
          ]}
        >
          <Feather name="trash-2" size={30} color={currentTheme.charcoal} />
          <Text style={{ color: currentTheme.charcoal }}> Clear </Text>
        </Pressable>
      </View>
      {recentSearches.length <= 0 && (
        <Text
          style={{
            fontSize: 30,
            fontWeight: "600",
            color:
              current == "dark" ? currentTheme.charcoal : currentTheme.gray,
          }}
        >
          No recent searches
        </Text>
      )}
      <FlatList
        style={{ marginLeft: "1%" }}
        data={recentSearches}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSearchQuery(item)}
            style={({ pressed }) => [
              {
                borderBottomWidth: pressed ? 4 : 2,
                width: "70%",
                paddingHorizontal: "1%",
                paddingTop: "10%",
                borderColor: pressed ? currentTheme.orange : currentTheme.gray,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                color: currentTheme.charcoal,
              }}
            >
              {item}
            </Text>
          </Pressable>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default RecentSearches;
