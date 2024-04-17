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
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    if (!name || !password) {
      alert("Please enter both username and password");
      setLoading(false);
      return;
    }
    if (password != confirmPassword) {
      alert("passwords don't match");
      setLoading(false);
      return;
    }
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
          setLoading(false);
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
    <View
      style={{
        backgroundColor: "#D1D5DB",
        height: "100%",
        width: "100%",
      }}
    >
      <View
        style={{
          marginHorizontal: 48,
          marginTop: 144,
          width: "100%",
        }}
      >
        <TextInput
          style={{
            borderBottomWidth: 4,
            borderBottomColor: "#718096",
            padding: 16,
            borderRadius: 16,
            width: "75%",
            marginBottom: 16,
          }}
          placeholder="Username"
          onChangeText={setName}
        />
        <TextInput
          style={{
            borderBottomWidth: 4,
            borderBottomColor: "#718096",
            padding: 16,
            borderRadius: 16,
            width: "75%",
            marginBottom: 16,
          }}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <View style={{ marginHorizontal: 48 }}>
          <Pressable style={{ width: "50%" }} onPress={handleSignUp}>
            {!loading ? (
              <Text
                style={{
                  backgroundColor: "#ea580c",
                  fontSize: 24,
                  color: "#E5E7EB",
                  paddingHorizontal: 32,
                  paddingVertical: 8,
                  borderRadius: 16,
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </Text>
            ) : (
              <View>
                <ActivityIndicator size="medium" color="orange" />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
