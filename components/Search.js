import React, { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";

const MainComponent = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Fetch data from the endpoint
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
    // Show results if search term length is at least 3 characters
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
    .slice(0, 20); // Show up to 20 results

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
        }}
        placeholder="Search by name"
        onChangeText={handleSearch}
        value={searchTerm}
      />
      {showResults && (
        <View>
          {filteredUsers.map((user) => (
            <Text key={user._id}>{user.name}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default MainComponent;
