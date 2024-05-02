import React, { useState } from "react";
import { Button, TextInput, View, Pressable, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../utils/context/Auth";
import { theme } from "../styles/colors";
import { Theme } from "../types/theme";
import { useTheme } from "../utils/context/Theme";
import { Feather, AntDesign } from "@expo/vector-icons";
import { styles_common } from "../styles/common";
import { styles_login } from "../styles/login";
import Loader from "../components/Loader";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/RootParams";
import { StatusBar } from "expo-status-bar";

type LoginScreenScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
interface LoginScreenProps {
  navigation: LoginScreenScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { username, updateUser } = useAuth();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const current = useTheme()?.current;
  const currentTheme = theme[current as keyof Theme];
  const node_url = process.env.EXPO_PUBLIC_NODE_URL;

  const handleLogin = async () => {
    if (!name || !password) {
      alert("Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${node_url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

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
      style={[styles_common.container, { backgroundColor: currentTheme.white }]}
    >
      <StatusBar translucent={true} />
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
              borderBottomColor: currentTheme.textInput,
              color: currentTheme.charcoal,
            },
          ]}
          selectionColor={currentTheme.orange}
          placeholder="Username"
          placeholderTextColor={currentTheme.charcoal}
          onChangeText={setName}
          value={name}
        />
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={[
              styles_login.TextInput,
              {
                borderBottomColor: currentTheme.textInput,
                color: currentTheme.charcoal,
              },
            ]}
            selectionColor={currentTheme.orange}
            placeholder="Password"
            placeholderTextColor={currentTheme.charcoal}
            secureTextEntry={passwordVisibility ? false : true}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setPasswordVisibility(!passwordVisibility)}>
            <View style={{ marginVertical: 26 }}>
              {passwordVisibility ? (
                <Feather name="eye" size={28} color={currentTheme.blue} />
              ) : (
                <Feather name="eye-off" size={28} color={currentTheme.blue} />
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
                    color: currentTheme.orange,
                  },
                ]}
              >
                Login
                <AntDesign name="login" size={36} color={currentTheme.orange} />
              </Text>
            ) : (
              <View style={{ marginHorizontal: 48 }}>
                <Loader height={110} width={110} />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
