import React, { useEffect, useState, useCallback } from "react";
import { Button, Text, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import "core-js/stable/atob";
import Modal_custom from "../components/Drawer";
import { useAuth } from "../utils/Auth";
import { useModal } from "../utils/Modal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Drawer_button from "../components/Drawer_button";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";

const Profile = ({ navigation }) => {
  const { current } = useTheme();
  const { modalVisible, setModalVisible } = useModal();
  const { username, updateUser, setUsername } = useAuth();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("jwtToken");
    setUsername("");
    updateUser();
  };
  useFocusEffect(
    useCallback(() => {
      if (!username) {
        navigation.replace("Welcome");
      }
    }, [username, navigation])
  );
  return (
    <View style={{ backgroundColor: theme[current].white, height: "100%" }}>
      <Drawer_button />

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "10%",
        }}
      >
        <MaterialIcons name="account-circle" size={64} color="black" />

        <Text style={{ fontSize: 50 }}>{username}</Text>

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
