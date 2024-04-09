import React, { useEffect } from "react";
import { View, Text, Pressable, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

const Welcome = ({ navigation }) => {
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      if (token) {
        navigation.navigate("Home");
      }
    };

    fetchUserDetails();
  }, []);

  return (
    // <ImageBackground source={require("../assets/flower.jpeg")}>
    <View>
      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text>
          Login <AntDesign name="login" size={24} color="black" />
        </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("SignUp")}>
        <Text>
          Sign Up <AntDesign name="adduser" size={24} color="black" />
        </Text>
      </Pressable>
    </View>
    // </ImageBackground>
  );
};

export default Welcome;
