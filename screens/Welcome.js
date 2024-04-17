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
        style={{ width: "100%", height: "33.333%" }}
      ></Image>
      <View
        style={{
          flexDirection: "row",
          height: "100%",
        }}
      >
        <Pressable
          style={{
            width: "50%",
            backgroundColor: "#ED8936",
            flex: 1,
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text
            style={{
              marginTop: "100%",
              fontSize: 36,
              fontWeight: "bold",
              color: "#718096",
            }}
          >
            Login
            {/* <AntDesign name="login" size={24} color="gray" /> */}
          </Text>
        </Pressable>
        <Pressable
          style={{
            width: "50%",
            backgroundColor: "#718096",
            flex: 1,
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text
            style={{
              marginTop: "100%",
              fontSize: 36,
              fontWeight: "bold",
              color: "#ED8936",
            }}
          >
            Sign Up
            {/* <AntDesign name="adduser" size={24} color="orange" /> */}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Welcome;
