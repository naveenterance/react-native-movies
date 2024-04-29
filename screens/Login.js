import React, { useState } from "react";
import { Button, TextInput, View, Pressable, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../utils/Auth";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { Feather, AntDesign } from "@expo/vector-icons";
import { styles_common } from "../styles/common";
import { styles_login } from "../styles/login";
import LottieView from "lottie-react-native";

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { username, updateUser } = useAuth();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
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
      setLoading(false);
      alert("Invalid credentials");
    } finally {
      updateUser();
    }
  };

  return (
    <View
      style={[
        styles_common.container,
        { backgroundColor: theme[current].white },
      ]}
    >
      <View
        style={{
          marginHorizontal: 48,
          marginTop: 144,
          width: "100%",
        }}
      >
        <TextInput
          style={[
            styles_login.TextInput,
            {
              borderBottomColor: theme[current].textInput,
              color: theme[current].charcoal,
            },
          ]}
          selectionColor={theme[current].orange}
          placeholder="Username"
          placeholderTextColor={theme[current].charcoal}
          onChangeText={setName}
          value={name}
        />
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={[
              styles_login.TextInput,
              {
                borderBottomColor: theme[current].textInput,
                color: theme[current].charcoal,
              },
            ]}
            selectionColor={theme[current].orange}
            placeholder="Password"
            placeholderTextColor={theme[current].charcoal}
            label="password"
            secureTextEntry={passwordVisibility ? false : true}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setPasswordVisibility(!passwordVisibility)}>
            <View style={{ marginVertical: 26 }}>
              {passwordVisibility ? (
                <Feather name="eye" size={28} color={theme[current].blue} />
              ) : (
                <Feather name="eye-off" size={28} color={theme[current].blue} />
              )}
            </View>
          </Pressable>
        </View>
        <View style={{ marginHorizontal: 48 }}>
          <Pressable style={{ width: "70%" }} onPress={handleLogin}>
            {!loading ? (
              <Text
                style={[
                  styles_login.text,
                  {
                    color: theme[current].orange,
                  },
                ]}
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
