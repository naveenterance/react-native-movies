import React, { useEffect, useState } from "react";
import { Button, Text, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import "core-js/stable/atob";
import Modal_custom from "../components/Drawer";
import { useAuth } from "../utils/Auth";
import { useModal } from "../utils/Modal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Profile = ({ navigation }) => {
  const { modalVisible, setModalVisible } = useModal();
  const { username, updateUser, setUsername } = useAuth();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("jwtToken");
    setUsername("");
    updateUser();
  };
  useFocusEffect(
    React.useCallback(() => {
      if (!username) {
        navigation.replace("Welcome");
      }
    }, [username, navigation])
  );
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "10%",
      }}
    >
      <Modal_custom
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />

      <Button title="modal " onPress={() => setModalVisible(true)} />
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
  );
};

export default Profile;
