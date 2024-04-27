import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { useSearchTerm } from "../utils/SearchTerm";
import { useAuth } from "../utils/Auth";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import Drawer_button from "../components/Drawer_button";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const UserSearch = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const { searchedUser, setSearchedUser } = useSearchTerm();
  const { username } = useAuth();
  const { current } = useTheme();

  useEffect(() => {
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

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        setSearchedUser(item.name);
        navigation.navigate("Bookmarks");
      }}
    >
      <View
        style={{
          borderBottomWidth: 4,
          borderColor: theme[current].gray,
          width: "80%",
          margin: "10%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <MaterialIcons name="account-circle" size={48} color="black" />
        <Text style={{ fontSize: 20 }} key={item._id}>
          {item.name}
        </Text>
      </View>
    </Pressable>
  );
  return (
    <View style={{ backgroundColor: theme[current].white, height: "100%" }}>
      <Drawer_button />
      <TextInput
        style={{
          backgroundColor: theme[current].white,
          width: "80%",
          marginTop: "2%",
          paddingHorizontal: "5%",
          paddingVertical: "2%",
          borderWidth: 2,
          borderColor: theme[current].charcoal,
          borderRadius: 999,
          fontSize: 16,
          marginHorizontal: "10%",
        }}
        selectionColor={theme[current].orange}
        placeholder="Search for Users"
        onChangeText={handleSearch}
        value={searchTerm}
      />
      {showResults && (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

export default UserSearch;
