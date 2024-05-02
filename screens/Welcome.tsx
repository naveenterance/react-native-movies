import React, { useCallback } from "react";
import { View, Text, Pressable, Image, Animated } from "react-native";
import { useAuth } from "../utils/context/Auth";
import { theme } from "../styles/colors";
import { Theme } from "../types/theme";
import { useTheme } from "../utils/context/Theme";
import usePressAnimation from "../hooks/animation";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/RootParams";

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Welcome"
>;
interface WelcomeProps {
  navigation: WelcomeScreenNavigationProp;
}

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const current = useTheme()?.current;
  const currentTheme = theme[current as keyof Theme];
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
              backgroundColor: currentTheme.orange,
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
                color: currentTheme.gray,
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
              backgroundColor: currentTheme.gray,
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
                color: currentTheme.orange,
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
