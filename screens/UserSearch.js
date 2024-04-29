import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { useSearchTerm } from "../utils/SearchTerm";
import { useAuth } from "../utils/Auth";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import Drawer_button from "../components/Drawer_button";
import { MaterialIcons } from "@expo/vector-icons";
import { styles_userSearch } from "../styles/userSearch";
import Loader from "../components/Loader";

const UserSearch = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { searchedUser, setSearchedUser } = useSearchTerm();
  const { username } = useAuth();
  const { current } = useTheme();

  useEffect(() => {
    setLoading(true);
    fetch("https://chat-node-naveenterances-projects.vercel.app/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);

    if (text.length >= 3) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        user.name !== username
    )
    .slice(0, 20);

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? theme[current].gray : theme[current].white,
        },
      ]}
      onPress={() => {
        setSearchedUser(item.name);
        navigation.navigate("Bookmarks");
      }}
    >
      <View
        style={[
          styles_userSearch.renderItems,
          {
            borderColor: theme[current].gray,
          },
        ]}
      >
        <MaterialIcons
          name="account-circle"
          size={48}
          color={theme[current].charcoal}
        />
        <Text
          style={{ fontSize: 20, color: theme[current].charcoal }}
          key={item._id}
        >
          {item.name}
        </Text>
      </View>
    </Pressable>
  );
  return (
    <View style={{ backgroundColor: theme[current].white, height: "100%" }}>
      <Drawer_button />
      <TextInput
        style={[
          styles_userSearch.textInput,
          {
            color: theme[current].charcoal,
            backgroundColor: theme[current].white,
            borderColor: theme[current].charcoal,
          },
        ]}
        selectionColor={theme[current].orange}
        placeholder="Search for Users"
        placeholderTextColor={theme[current].charcoal}
        onChangeText={handleSearch}
        value={searchTerm}
      />
      {loading && <Loader height={210} width={210} />}
      {showResults ? (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <View style={{ alignItems: "center" }}>
          <MaterialIcons
            name="person-search"
            size={96}
            color={theme[current].charcoal}
          />
        </View>
      )}
    </View>
  );
};

export default UserSearch;
