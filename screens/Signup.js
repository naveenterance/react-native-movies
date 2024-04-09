import React, { useState } from "react";
import {
  TextInput,
  View,
  Pressable,
  Text,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://chat-node-naveenterances-projects.vercel.app/users/${name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          alert("Username not available");
          return;
        }
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
    }

    try {
      const response = await fetch(
        "https://chat-node-naveenterances-projects.vercel.app/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Sign up failed");
      }
      setLoading(true);
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Account created successfully",
        },
        trigger: { seconds: 2 },
      });
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <ImageBackground source={require("../assets/flower.jpeg")}>
    <View>
      <TextInput placeholder="Username" value={name} onChangeText={setName} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Pressable onPress={handleSignUp}>
        {!loading ? (
          <Text>
            Signup <AntDesign name="login" size={24} color="black" />
          </Text>
        ) : (
          <ActivityIndicator size="medium" color="gray" />
        )}
      </Pressable>
    </View>
    // </ImageBackground>
  );
};

export default SignUpScreen;
