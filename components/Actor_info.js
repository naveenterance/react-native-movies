import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";

const SearchActors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const API_KEY = "e24ea998";

  const searchActors = async () => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`
      );
      const data = await response.json();
      if (data.Search) {
        // Filter out duplicate actors
        const uniqueActors = Array.from(
          new Set(data.Search.map((item) => item.Actors))
        ).map((actor) => ({ Name: actor }));
        setSearchResults(uniqueActors);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ marginVertical: 8 }}>
      <Text>{item.Name}</Text>
      {/* You can display more actor details here */}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 8,
        }}
        placeholder="Search actors..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <Button title="Search" onPress={searchActors} />
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default SearchActors;
