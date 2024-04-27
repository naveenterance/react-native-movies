import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useSearchTerm } from "../utils/SearchTerm";

const UserSearch = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const { searchedUser, setSearchedUser } = useSearchTerm();

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
        user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 20);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          paddingHorizontal: 10,
          marginTop: 150,
        }}
        placeholder="Search by name"
        onChangeText={handleSearch}
        value={searchTerm}
      />
      {showResults && (
        <View>
          {filteredUsers.map((user) => (
            <Pressable
              onPress={() => {
                setSearchedUser(user.name);
                navigation.navigate("Bookmarks");
              }}
            >
              <Text key={user._id}>{user.name}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default UserSearch;
