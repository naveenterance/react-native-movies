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
import { useAuth } from "../utils/Auth";
const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const handleLogin = async () => {
    if (!name || !password) {
      alert("Please enter both username and password");
      return;
    }

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
      updateUser();
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
          <Pressable style={{ width: "50%" }} onPress={handleLogin}>
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
