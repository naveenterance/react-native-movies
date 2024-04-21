import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Image } from "react-native";
import LoginScreen from "./screens/Login";
import HomeScreen from "./screens/Home";
import SignUpScreen from "./screens/Signup";
import Welcome from "./screens/Welcome";
import Profile from "./screens/Profile";
import Search from "./screens/Search";
import Bookmarks from "./screens/Bookmarks";
import Movie_info from "./screens/Movie_info";
import { AuthProvider } from "./utils/Auth";
import { IDProvider } from "./utils/CurrentId";
import { ModalProvider } from "./utils/Modal";

import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();

const client = new ApolloClient({
  uri: "https://movie-prisma.vercel.app/",
  cache: new InMemoryCache(),
});

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
    <AuthProvider>
      <IDProvider>
        <ModalProvider>
          <ApolloProvider client={client}>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={screenOptions}
              >
                <Stack.Screen
                  name="Welcome"
                  component={Welcome}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="SignUp"
                  component={SignUpScreen}
                  options={{
                    headerTitle: "Sign Up",
                    headerStyle: {
                      backgroundColor: "#ea580c",
                    },
                  }}
                />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{
                    headerTitle: "Login",
                    headerStyle: {
                      backgroundColor: "#ea580c",
                    },
                  }}
                />
                <Stack.Screen
                  name="Profile"
                  component={Profile}
                  options={{
                    headerTitle: "Profile",
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
                  name="Search"
                  component={Search}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Movie_info"
                  component={Movie_info}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Bookmarks"
                  component={Bookmarks}
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </ApolloProvider>
        </ModalProvider>
      </IDProvider>
    </AuthProvider>
  );
};

export default App;
