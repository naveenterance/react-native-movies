import React from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../utils/graphql";
import { useAuth } from "../utils/Auth";

const Bookmarks = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const { username } = useAuth();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const bookmarkedMovies = data.allUsers.filter(
    (user) => user.username === username && user.rating === "[to be watched]"
  );

  console.log(bookmarkedMovies);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarked Movies</Text>
      <FlatList
        data={bookmarkedMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.movieId}</Text>
          </View>
        )}
      />
      <Button
        title="Go to Movie Info"
        onPress={() => navigation.navigate("Movie_info")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default Bookmarks;
