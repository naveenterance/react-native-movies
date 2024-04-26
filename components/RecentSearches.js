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
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";

const RecentSearches = ({
  recentSearches,
  setRecentSearches,
  setSearchQuery,
}) => {
  const { username } = useAuth();
  const { current } = useTheme();
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
            backgroundColor: theme[current].orange,
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
              // paddingHorizontal: "1%",
              padding: "2%",
              // borderRightWidth: pressed ? 4 : 0,
              // borderColor: theme[current].orange,
              backgroundColor: pressed
                ? theme[current].gray
                : theme[current].white,
            },
          ]}
        >
          <Feather name="trash-2" size={30} color="black" />
          <Text> Clear </Text>
        </Pressable>
      </View>
      {recentSearches.length <= 0 && (
        <Text
          style={{
            fontSize: 30,
            fontWeight: "600",
            color: theme[current].gray,
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
                borderColor: pressed
                  ? theme[current].orange
                  : theme[current].gray,
              },
            ]}
          >
            <Text style={{ fontSize: 16 }}>{item}</Text>
          </Pressable>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default RecentSearches;
