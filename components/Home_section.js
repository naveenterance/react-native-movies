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
import { useNavigation } from "@react-navigation/native";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { useID } from "../utils/CurrentId";

const List = ({ tab }) => {
  const { current } = useTheme();
  const navigation = useNavigation();
  const { id, setId } = useID();
  const API_KEY = "e24ea998";

  const handlepress = (m_id) => {
    setId(m_id);
    navigation.navigate("Movie_info");
  };

  return (
    <ScrollView horizontal={true}>
      <View style={{ flexDirection: "row", height: "100%" }}>
        {tab.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => handlepress(item["movieId"])}
            style={({ pressed }) => [
              {
                borderWidth: pressed ? 4 : 0,

                borderColor: theme[current].orange,
              },
            ]}
          >
            <Image
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
