import React, { useEffect, useState } from "react";
import { Button, Text, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const handleLogout = async () => {
    await AsyncStorage.removeItem("jwtToken");
    navigation.navigate("Login");
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (token) {
          const decoded = jwtDecode(token);
          setUser(decoded);
        }
      } catch (error) {
        console.error("Error retrieving user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "10%",
      }}
    >
      <MaterialIcons name="account-circle" size={64} color="black" />

      <Text style={{ fontSize: 50 }}>{user.name}</Text>

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
