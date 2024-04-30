import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeProps {
  current: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const CurrentTheme = createContext<ThemeProps | undefined>(undefined);

const ThemeProvider: React.FC = ({ children }: any) => {
  const [current, setCurrent] = useState<"light" | "dark">("light");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme !== null) {
        setCurrent(savedTheme as "light" | "dark");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const setAndStoreTheme = async (theme: "light" | "dark") => {
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
