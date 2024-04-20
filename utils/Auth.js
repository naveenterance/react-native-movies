// Auth.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (token) {
          const decoded = jwtDecode(token);
          setUsername(decoded.name);
        }
      } catch (error) {
        console.error("Error retrieving user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const updateUser = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (token) {
        const decoded = jwtDecode(token);
        setUsername(decoded.name);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ username, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
