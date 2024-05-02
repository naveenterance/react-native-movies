import React from "react";
import { View, Pressable } from "react-native";
import { useTheme } from "../utils/context/Theme";
import { theme } from "../styles/colors";
import { Theme } from "../types/theme";
import { Feather } from "@expo/vector-icons";
import Modal_custom from "./Drawer";
import { useModal } from "../utils/context/Modal";

const Drawer_button: React.FC = () => {
  const current = useTheme()?.current;
  const currentTheme = theme[current as keyof Theme];
  const { modalVisible, setModalVisible } = useModal();

  return (
    <View>
      <View
        style={{
          marginTop: "10%",
          marginLeft: "2%",
          width: "10%",
        }}
      >
        <Pressable
          style={({ pressed }) => [
            {
              borderLeftWidth: pressed ? 4 : 0,
              padding: "2%",
              borderColor: currentTheme.orange,
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="menu" size={36} color={currentTheme.charcoal} />
        </Pressable>
      </View>
      <Modal_custom />
    </View>
  );
};

export default Drawer_button;
