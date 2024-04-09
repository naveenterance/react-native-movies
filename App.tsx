import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";
import LoginScreen from "./screens/Login";
import HomeScreen from "./screens/Home";
import SignUpScreen from "./screens/Signup";
import Welcome from "./screens/Welcome";

import Profile from "./screens/Profile";

import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const screenOptions = {
    headerTitleAlign: "center",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={screenOptions}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerTitle: () => null,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            headerTitle: "Sign Up",
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: "Login",
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerTitle: "Profile",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
