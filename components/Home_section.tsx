import React from "react";
import { View, Pressable, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme, Theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { useID } from "../utils/CurrentId";

interface User {
  movieId: string;
  username: string;
  rating: string;
  review: string;
}

interface ListProps {
  tab: User[];
}

const List: React.FC<ListProps> = ({ tab }) => {
  const current = useTheme()?.current;
  const currentTheme = theme[current as keyof Theme];
  const navigation = useNavigation();
  const { id, setId } = useID();
  const API_KEY = "e24ea998";

  const handlepress = (m_id: string) => {
    setId(m_id);
    (navigation as { navigate: (screen: string) => void }).navigate(
      "Movie_info"
    );
  };

  return (
    <ScrollView horizontal={true}>
      <View style={{ flexDirection: "row", height: "100%" }}>
        {tab.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => handlepress(item.movieId)}
            style={({ pressed }) => [
              {
                borderWidth: pressed ? 4 : 0,
                height: 220,
                width: 220,
                borderColor: currentTheme.orange,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Image
              style={{
                height: 200,
                width: 200,
              }}
              source={{
                uri: `http://img.omdbapi.com/?apikey=${API_KEY}&i=${item.movieId}`,
              }}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default List;
