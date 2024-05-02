import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { useSearchTerm } from "../utils/context/SearchTerm";
import { useAuth } from "../utils/context/Auth";
import { theme } from "../styles/colors";
import { Theme } from "../types/theme";
import { useTheme } from "../utils/context/Theme";
import Drawer_button from "../components/Drawer_button";
import { MaterialIcons } from "@expo/vector-icons";
import { styles_userSearch } from "../styles/userSearch";
import Loader from "../components/Loader";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/RootParams";

type UserSearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserSearch"
>;
interface UserSearchProps {
  navigation: UserSearchScreenNavigationProp;
}

interface User {
  _id: string;
  name: string;
}

const UserSearch: React.FC<UserSearchProps> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { searchedUser, setSearchedUser } = useSearchTerm();
  const { username } = useAuth();
  const current = useTheme()?.current;
  const currentTheme = theme[current as keyof Theme];

  useEffect(() => {
    setLoading(true);
    fetch("https://movie-app-node-dun.vercel.app/users")
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

  const handleSearch = (text: string) => {
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

  const renderItem = ({ item }: { item: User }) => (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? currentTheme.gray : currentTheme.white,
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
            borderColor: currentTheme.gray,
          },
        ]}
      >
        <MaterialIcons
          name="account-circle"
          size={48}
          color={currentTheme.charcoal}
        />
        <Text
          style={{ fontSize: 20, color: currentTheme.charcoal }}
          key={item._id}
        >
          {item.name}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={{ backgroundColor: currentTheme.white, height: "100%" }}>
      <Drawer_button />
      <TextInput
        style={[
          styles_userSearch.textInput,
          {
            color: currentTheme.charcoal,
            backgroundColor: currentTheme.white,
            borderColor: currentTheme.charcoal,
          },
        ]}
        selectionColor={currentTheme.orange}
        placeholder="Search for Users"
        placeholderTextColor={currentTheme.charcoal}
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
            color={currentTheme.charcoal}
          />
        </View>
      )}
    </View>
  );
};

export default UserSearch;
