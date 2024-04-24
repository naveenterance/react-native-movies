import React, { useState } from "react";
import {
  TextInput,
  View,
  Pressable,
  Text,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import Modal from "react-native-modal";

import * as Notifications from "expo-notifications";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { current } = useTheme();

  const handleSignUp = async () => {
    setLoading(true);
    if (!name || !password) {
      alert("Please enter both username and password");
      setLoading(false);
      return;
    }
    if (password != confirmPassword) {
      alert("Passwords don't match");
      setLoading(false);
      return;
    }
    if (password.length < 3) {
      alert("Passwords too weak");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `https://chat-node-naveenterances-projects.vercel.app/users/${name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          alert("Username not available");
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
    }

    try {
      const response = await fetch(
        "https://chat-node-naveenterances-projects.vercel.app/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Sign up failed");
      }
      setLoading(true);
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Account created successfully",
        },
        trigger: { seconds: 2 },
      });

      setModalVisible(true);
      const timer = setTimeout(() => {
        navigation.replace("Login");
        setModalVisible(false);
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme[current].white,
        height: "100%",
        width: "100%",
      }}
    >
      <Modal
        isVisible={modalVisible}
        style={{
          flex: 1,
          maxHeight: "30%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme[current].white,
          marginVertical: "50%",
          borderRadius: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              margin: 10,
              color: theme[current].green,
              fontWeight: "bold",
            }}
          >
            !! Success !!
          </Text>
          <Text style={{ fontSize: 16, margin: 20 }}>
            You have successfully created an account,now login to that account{" "}
          </Text>
          <Pressable onPress={() => navigation.replace("Login")}>
            <LottieView
              style={{ width: 60, height: 60, padding: 30 }}
              source={require("../assets/tick.json")}
              autoPlay
              loop={false}
              speed={6}
            />
          </Pressable>
        </View>
      </Modal>

      <View
        style={{
          marginHorizontal: 48,
          marginTop: "30%",
          width: "100%",
        }}
      >
        <TextInput
          style={{
            borderBottomWidth: 4,
            borderBottomColor: theme[current].textInput,
            padding: 16,
            borderRadius: 16,
            width: "75%",
            marginBottom: 16,
          }}
          selectionColor={theme[current].orange}
          placeholder="Username"
          onChangeText={setName}
        />
        <TextInput
          style={{
            borderBottomWidth: 4,
            borderBottomColor: theme[current].textInput,
            padding: 16,
            borderRadius: 16,
            width: "75%",
            marginBottom: 16,
          }}
          selectionColor={theme[current].orange}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        {password && (
          <View>
            <Text style={{ margin: 12, fontSize: 20 }}>
              [
              {(password.length < 3 && "Weak") ||
                (password.length < 6 && "Moderate") ||
                (password.length >= 6 && "Strong")}
              ]
            </Text>

            <View
              style={{
                width: `${(password.length < 7 ? password.length : 7) * 10}%`,
                backgroundColor: `${
                  (password.length < 3 && theme[current].red) ||
                  (password.length < 6 && theme[current].orange) ||
                  (password.length >= 6 && theme[current].green)
                }`,
                height: 10,
                alignItems: "center",
                padding: 2,
                borderRadius: 999,
                fontSize: 10,
                fontWeight: "500",
                color: "#4299E1",
                textAlign: "center",
                lineHeight: 10,
              }}
            ></View>
          </View>
        )}
        <TextInput
          style={{
            borderBottomWidth: 4,
            borderBottomColor: theme[current].textInput,
            padding: 16,
            borderRadius: 16,
            width: "75%",
            marginBottom: 16,
          }}
          selectionColor={theme[current].orange}
          placeholder="Confirm Password"
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
        />
        <View style={{ marginHorizontal: 48 }}>
          <Pressable style={{ width: "70%" }} onPress={handleSignUp}>
            {!loading ? (
              <Text
                style={{
                  fontSize: 36,
                  color: theme[current].orange,
                  paddingHorizontal: "10%",
                  paddingVertical: "20%",
                  fontWeight: "bold",
                }}
              >
                SignUp
                <AntDesign
                  name="adduser"
                  size={36}
                  color={theme[current].orange}
                />
              </Text>
            ) : (
              <View style={{ marginHorizontal: 48 }}>
                <LottieView
                  style={{ width: 110, height: 110, padding: 16 }}
                  source={require("../assets/loader4.json")}
                  autoPlay
                  loop
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
