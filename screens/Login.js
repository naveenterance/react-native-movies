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
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const { current } = useTheme();
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
      setName("");
      setPassword("");

      const timer = setTimeout(() => {
        navigation.navigate("Home");
        setLoading(false);
      }, 10);

      return () => clearTimeout(timer);
    } catch (error) {
      alert("Invalid credentials");
    } finally {
      updateUser();
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme[current].white,
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
            borderBottomColor: theme[current].textInput,
            padding: 16,
            borderRadius: 16,
            width: "75%",
            marginBottom: 16,
            fontSize: 16,
          }}
          selectionColor={theme[current].orange}
          placeholder="Username"
          onChangeText={setName}
          value={name}
        />
        <TextInput
          style={{
            borderBottomWidth: 4,
            borderBottomColor: theme[current].textInput,
            padding: 16,
            borderRadius: 16,
            width: "75%",
            marginBottom: 16,
            fontSize: 16,
          }}
          selectionColor={theme[current].orange}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <View style={{ marginHorizontal: 48 }}>
          <Pressable style={{ width: "70%" }} onPress={handleLogin}>
            {!loading ? (
              <Text
                style={{
                  fontSize: 36,
                  color: theme[current].orange,
                  paddingHorizontal: "10%",
                  paddingVertical: "20%",

                  fontWeight: "bold",
                }}
              >
                Login
                <AntDesign
                  name="login"
                  size={36}
                  color={theme[current].orange}
                />
              </Text>
            ) : (
              <View style={{ marginHorizontal: 48 }}>
                {/* <ActivityIndicator
                  size="medium"
                  color={theme[current].orange}
                /> */}
                <LottieView
                  style={{ width: 110, height: 110, padding: 16 }}
                  source={require("../assets/loader4.json")}
                  autoPlay
                  loop
                />
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
