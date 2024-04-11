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
    <View className="bg-gray-300 h-screen w-screen">
      <View className="mx-12 my-36  w-full">
        <TextInput
          className="border-4 border-gray-600  p-4 rounded-xl w-3/4 focus:border-orange-600 mb-4"
          placeholder="Username"
          onChangeText={setName}
        />
        <TextInput
          className="border-4 border-gray-600 p-4 rounded-xl w-3/4 focus:border-orange-600 mb-4"
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <View className="mx-12">
          <Pressable className="w-1/2 " onPress={handleLogin}>
            {!loading ? (
              <Text className="bg-orange-600 text-xl  text-gray-300 px-8 py-2 rounded-xl font-bold ">
                Login
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

LoginScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: () => (
    <Button title="Back" onPress={() => navigation.navigate("Welcome")} />
  ),
});

export default LoginScreen;
