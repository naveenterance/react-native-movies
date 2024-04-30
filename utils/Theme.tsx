import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CurrentTheme = createContext();

const ThemeProvider = ({ children }: any) => {
  const [current, setCurrent] = useState("light");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme !== null) {
        setCurrent(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const setAndStoreTheme = async (theme: any) => {
    try {
      await AsyncStorage.setItem("theme", theme);
      setCurrent(theme);
    } catch (error) {
      console.error("Error storing theme:", error);
    }
  };

  return (
    <CurrentTheme.Provider value={{ current, setTheme: setAndStoreTheme }}>
      {children}
    </CurrentTheme.Provider>
  );
};

const useTheme = () => useContext(CurrentTheme);

export { ThemeProvider, useTheme };
