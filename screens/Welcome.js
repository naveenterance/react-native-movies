import React, { useEffect, useCallback } from "react";
import { View, Text, Pressable, Image, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "../utils/Auth";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import usePressAnimation from "../hooks/animation";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Welcome = ({ navigation }) => {
  const { current } = useTheme();
  const [onPressLoginHandler, scaleValueLogin] = usePressAnimation(() => {
    navigation.navigate("Login");
  });
  const [onPressSignUpHandler, scaleValueSignup] = usePressAnimation(() => {
    navigation.navigate("SignUp");
  });
  const { username } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (username) {
        navigation.replace("Home");
      }
    }, [username, navigation])
  );
  return (
    <View>
      <Image
        source={require("../assets/logo.jpeg")}
        style={{ width: "100%", height: "33.333%" }}
      />
      <View style={{ flexDirection: "row", height: "100%" }}>
        <Pressable
          onPress={onPressLoginHandler}
          style={{ width: "50%", alignItems: "center" }}
        >
          <Animated.View
            style={{
              backgroundColor: theme[current].orange,
              alignItems: "center",
              height: "100%",
              width: "100%",
              transform: [{ scale: scaleValueLogin }],
            }}
          >
            <Text
              style={{
                marginTop: "100%",
                fontSize: 36,
                fontWeight: "bold",
                color: theme[current].gray,
              }}
            >
              Login
            </Text>
          </Animated.View>
        </Pressable>
        <Pressable
          onPress={onPressSignUpHandler}
          style={{ width: "50%", alignItems: "center" }}
        >
          <Animated.View
            style={{
              backgroundColor: theme[current].gray,
              alignItems: "center",
              height: "100%",
              width: "100%",
              transform: [{ scale: scaleValueSignup }],
            }}
          >
            <Text
              style={{
                marginTop: "100%",
                fontSize: 36,
                fontWeight: "bold",
                color: theme[current].orange,
              }}
            >
              SignUp
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

export default Welcome;
