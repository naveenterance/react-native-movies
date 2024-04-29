import React, { useState } from "react";
import { TextInput, View, Pressable, Text } from "react-native";
import Modal from "react-native-modal";
import * as Notifications from "expo-notifications";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { styles_common } from "../styles/common";
import { styles_signup } from "../styles/signup";
import Loader from "../components/Loader";

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
      style={[
        styles_common.container,
        {
          backgroundColor: theme[current].white,
        },
      ]}
    >
      <Modal
        isVisible={modalVisible}
        style={[
          styles_signup.Modal,
          {
            backgroundColor: theme[current].gray,
          },
        ]}
      >
        <View style={styles_signup.Modal.View}>
          <Text
            style={[
              styles_signup.Modal.Text,
              {
                color: theme[current].green,
              },
            ]}
          >
            !! Success !!
          </Text>
          <Text
            style={{ fontSize: 16, margin: 20, color: theme[current].charcoal }}
          >
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
          style={[
            styles_signup.TextInput,
            {
              borderBottomColor: theme[current].textInput,
              color: theme[current].charcoal,
            },
          ]}
          selectionColor={theme[current].orange}
          placeholder="Username"
          placeholderTextColor={theme[current].charcoal}
          onChangeText={setName}
        />
        <TextInput
          style={[
            styles_signup.TextInput,
            {
              borderBottomColor: theme[current].textInput,
              color: theme[current].charcoal,
            },
          ]}
          selectionColor={theme[current].orange}
          placeholder="Password"
          placeholderTextColor={theme[current].charcoal}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        {password && (
          <View>
            <Text
              style={{
                margin: 12,
                fontSize: 20,
                color: theme[current].charcoal,
              }}
            >
              [
              {(password.length < 3 && "Weak") ||
                (password.length < 6 && "Moderate") ||
                (password.length >= 6 && "Strong")}
              ]
            </Text>

            <View
              style={[
                styles_signup.PasswordBar,
                {
                  width: `${(password.length < 7 ? password.length : 7) * 10}%`,
                  backgroundColor: `${
                    (password.length < 3 && theme[current].red) ||
                    (password.length < 6 && theme[current].orange) ||
                    (password.length >= 6 && theme[current].green)
                  }`,

                  color: theme[current].gray,
                },
              ]}
            ></View>
          </View>
        )}
        <TextInput
          style={[
            styles_signup.TextInput,
            {
              borderBottomColor: theme[current].textInput,
              color: theme[current].charcoal,
            },
          ]}
          selectionColor={theme[current].orange}
          placeholder="Confirm Password"
          placeholderTextColor={theme[current].charcoal}
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
        />
        <View style={{ marginHorizontal: 48 }}>
          <Pressable style={{ width: "70%" }} onPress={handleSignUp}>
            {!loading ? (
              <Text
                style={[
                  styles_signup.Text,
                  {
                    color: theme[current].orange,
                  },
                ]}
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
                <Loader height={110} width={110} />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
