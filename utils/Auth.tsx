import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

interface AuthContextType {
  username: string;
  updateUser: () => void;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (token) {
          const decoded: any = jwtDecode(token);
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
        const decoded: any = jwtDecode(token);
        setUsername(decoded.name);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ username, updateUser, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
