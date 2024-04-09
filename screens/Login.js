import React, { useState } from "react";
import {
  Button,
  TextInput,
  View,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://chat-node-naveenterances-projects.vercel.app/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      await AsyncStorage.setItem("jwtToken", responseData.token);

      navigation.navigate("Home");
    } catch (error) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={setName} />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Pressable onPress={handleLogin}>
        {!loading ? (
          <Text>
            Login <AntDesign name="login" size={36} color="black" />
          </Text>
        ) : (
          <ActivityIndicator size="medium" color="gray" />
        )}
      </Pressable>
    </View>
  );
};

LoginScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: () => (
    <Button title="Back" onPress={() => navigation.navigate("Welcome")} />
  ),
});

export default LoginScreen;
