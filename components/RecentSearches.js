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

const RecentSearches = ({
  recentSearches,
  setRecentSearches,
  setSearchQuery,
}) => {
  const { username } = useAuth();
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
    <View style={{ marginHorizontal: "12%" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        [Recent Searches]
      </Text>
      <Button title="Clear Recent Searches" onPress={clearRecentSearches} />
      <FlatList
        data={recentSearches}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSearchQuery(item)}>
            <Text style={{ fontSize: 16 }}>{item}</Text>
          </Pressable>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default RecentSearches;
