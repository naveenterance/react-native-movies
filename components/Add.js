import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const ADD_USER = gql`
  mutation CreateUser($username: String!, $movieId: String!, $rating: String!) {
    create(username: $username, movieId: $movieId, rating: $rating) {
      id
      username
      movieId
      rating
    }
  }
`;

const AddUserForm = () => {
  const [username, setUsername] = useState("");
  const [movieId, setMovieId] = useState("");
  const [rating, setRating] = useState("");

  const [addUser] = useMutation(ADD_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUser({
        variables: {
          username,
          movieId,
          rating,
        },
      });

      setUsername("");
      setMovieId("");
      setRating("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <View>
      <Text>Add New User</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={{ borderWidth: 1, borderColor: "black", marginBottom: 10 }}
      />
      <TextInput
        placeholder="Movie ID"
        value={movieId}
        onChangeText={(text) => setMovieId(text)}
        style={{ borderWidth: 1, borderColor: "black", marginBottom: 10 }}
      />
      <TextInput
        placeholder="Rating"
        value={rating}
        onChangeText={(text) => setRating(text)}
        style={{ borderWidth: 1, borderColor: "black", marginBottom: 10 }}
      />
      <Button title="Add User" onPress={handleSubmit} />
    </View>
  );
};

export default AddUserForm;
