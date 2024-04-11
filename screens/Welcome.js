import React, { useEffect } from "react";
import { View, Text, Pressable, ImageBackground, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import "core-js/stable/atob";
import { styled } from "nativewind";

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
      <Image
        source={require("../assets/logo.jpeg")}
        className="w-full h-1/3"
      ></Image>
      <View className="flex-row h-screen ">
        <Pressable
          className="w-1/2 bg-orange-600 "
          onPress={() => navigation.navigate("Login")}
        >
          <Text className="m-24 text-2xl font-bold text-gray-600">
            Login
            {/* <AntDesign name="login" size={24} color="gray" /> */}
          </Text>
        </Pressable>
        <Pressable
          className="w-1/2 bg-gray-600  hover:bg-blue-300"
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text className="m-24 text-2xl font-bold text-orange-600">
            Sign Up
            {/* <AntDesign name="adduser" size={24} color="orange" /> */}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Welcome;
