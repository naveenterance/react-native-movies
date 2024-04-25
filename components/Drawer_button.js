import React, { useState, useEffect } from "react";

import Modal from "react-native-modal";
import { useModal } from "../utils/Modal";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Pressable,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Modal_custom from "./Drawer";

const Drawer_button = () => {
  const { current } = useTheme();

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
              borderColor: theme[current].orange,
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="menu" size={36} color="black" />
        </Pressable>
      </View>
      <Modal_custom
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default Drawer_button;
