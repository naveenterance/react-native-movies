import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
const API_KEY = "e24ea998";
const List = ({ tab }) => {
  const { current } = useTheme();
  const navigation = useNavigation();
  return (
    <ScrollView horizontal={true}>
      <View style={{ flexDirection: "row", height: "100%" }}>
        {tab.map((item, index) => (
          <Pressable
            style={({ pressed }) => [
              {
                borderWidth: pressed ? 4 : 0,

                borderColor: theme[current].orange,
              },
            ]}
          >
            <Image
              key={index}
              style={{
                height: 200,
                width: 200,
                margin: 10,
              }}
              source={{
                uri: `http://img.omdbapi.com/?apikey=${API_KEY}&i=${item["movieId"]}`,
              }}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default List;
