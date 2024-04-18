import {
  Button,
  TextInput,
  View,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import {
  AntDesign,
  MaterialIcons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const Navbar = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        height: "10%",
        backgroundColor: "#E5E7EB",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: "10%",
        }}
      >
        <Pressable>
          <AntDesign name="home" size={30} color="black" />
        </Pressable>
        <Pressable>
          <AntDesign name="search1" size={30} color="black" />
        </Pressable>

        <Pressable>
          <Feather name="bookmark" size={30} color="black" />
        </Pressable>
        <Pressable>
          <FontAwesome name="user-circle-o" size={30} color="black" />
        </Pressable>
      </View>
    </View>
  );
};

export default Navbar;
