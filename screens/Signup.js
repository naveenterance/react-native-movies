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
    <View className="bg-gray-300 h-screen w-screen">
      <View className="mx-12 my-36  w-full">
        <TextInput
          className="border-4 border-gray-600  p-4 rounded-xl w-3/4 focus:border-orange-600 mb-4"
          placeholder="Username"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="border-4 border-gray-600  p-4 rounded-xl w-3/4 focus:border-orange-600 mb-4"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <View className="mx-12">
          <Pressable className="w-1/2 " onPress={handleSignUp}>
            {!loading ? (
              <Text className="bg-orange-600 text-xl  text-gray-300 px-8 py-2 rounded-xl font-bold ">
                SignUp
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
