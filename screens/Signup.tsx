import React, { useState } from "react";
import { TextInput, View, Pressable, Text } from "react-native";
import Modal from "react-native-modal";
import * as Notifications from "expo-notifications";
import { theme, Theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { styles_common } from "../styles/common";
import { styles_signup } from "../styles/signup";
import Loader from "../components/Loader";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/RootParams";

type SignUpScreenScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignUp"
>;
interface SignUpScreenProps {
  navigation: SignUpScreenScreenNavigationProp;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { current } = useTheme();
  const currentTheme = theme[current as keyof Theme];

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
        `https://movie-app-node-dun.vercel.app/users/${name}`,
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
        "https://movie-app-node-dun.vercel.app/users",
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
          backgroundColor: currentTheme.white,
        },
      ]}
    >
      <Modal
        isVisible={modalVisible}
        style={[
          styles_signup.Modal,
          {
            backgroundColor: currentTheme.white,
          },
        ]}
      >
        <View style={styles_signup.Modal.View}>
          <Text
            style={[
              styles_signup.Modal.Text,
              {
                color: currentTheme.green,
              },
            ]}
          >
            !! Success !!
          </Text>
          <Text
            style={{ fontSize: 16, margin: 20, color: currentTheme.charcoal }}
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
              borderBottomColor: currentTheme.textInput,
              color: currentTheme.charcoal,
            },
          ]}
          selectionColor={currentTheme.orange}
          placeholder="Username"
          placeholderTextColor={currentTheme.charcoal}
          onChangeText={setName}
        />
        <TextInput
          style={[
            styles_signup.TextInput,
            {
              borderBottomColor: currentTheme.textInput,
              color: currentTheme.charcoal,
            },
          ]}
          selectionColor={currentTheme.orange}
          placeholder="Password"
          placeholderTextColor={currentTheme.charcoal}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        {password && (
          <View>
            <Text
              style={{
                margin: 12,
                fontSize: 20,
                color: currentTheme.charcoal,
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
                    (password.length < 3 && currentTheme.red) ||
                    (password.length < 6 && currentTheme.orange) ||
                    (password.length >= 6 && currentTheme.green)
                  }`,

                  color: currentTheme.gray,
                },
              ]}
            ></View>
          </View>
        )}
        <TextInput
          style={[
            styles_signup.TextInput,
            {
              borderBottomColor: currentTheme.textInput,
              color: currentTheme.charcoal,
            },
          ]}
          selectionColor={currentTheme.orange}
          placeholder="Confirm Password"
          placeholderTextColor={currentTheme.charcoal}
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
                    color: currentTheme.orange,
                  },
                ]}
              >
                SignUp
                <AntDesign
                  name="adduser"
                  size={36}
                  color={currentTheme.orange}
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