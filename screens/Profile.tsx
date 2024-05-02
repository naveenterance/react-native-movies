import React, { useEffect, useState, useCallback } from "react";
import { Text, View, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import "core-js/stable/atob";
import { useAuth } from "../utils/context/Auth";
import { useFocusEffect } from "@react-navigation/native";
import Drawer_button from "../components/Drawer_button";
import { theme } from "../styles/colors";
import { Theme } from "../types/theme";
import { useTheme } from "../utils/context/Theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/RootParams";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;
interface ProfileProps {
  navigation: ProfileScreenNavigationProp;
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const current = useTheme()?.current;
  const { username, updateUser, setUsername } = useAuth();
  const currentTheme = theme[current as keyof Theme];

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            await AsyncStorage.removeItem("jwtToken");
            setUsername("");
            updateUser();
          },
        },
      ],
      { cancelable: false }
    );
  };

  useFocusEffect(
    useCallback(() => {
      if (!username) {
        navigation.replace("Welcome");
      }
    }, [username, navigation])
  );
  return (
    <View style={{ backgroundColor: currentTheme.white, height: "100%" }}>
      <Drawer_button />

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "10%",
        }}
      >
        <MaterialIcons
          name="account-circle"
          size={64}
          color={currentTheme.charcoal}
        />

        <Text style={{ color: currentTheme.charcoal, fontSize: 50 }}>
          {username}
        </Text>

        <Pressable
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1.0 },
            { marginTop: "10%" },
          ]}
          onPress={handleLogout}
        >
          <Text style={{ color: "red", fontSize: 30 }}>
            Logout <AntDesign name="logout" size={24} color="red" />
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Profile;
