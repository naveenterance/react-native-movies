import Modal from "react-native-modal";
import { useModal } from "../utils/Modal";
import { Text, View, Button, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";

const Modal_custom = () => {
  const { modalVisible, setModalVisible } = useModal();
  const { current, setTheme } = useTheme();

  const navigation = useNavigation();
  const toggleTheme = () => {
    const newTheme = current === "light" ? "dark" : "light";
    setTheme(newTheme);
  };
  return (
    <View style={{ flex: 1, marginTop: "20%" }}>
      <View style={styles.centeredView}>
        <Modal
          isVisible={modalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          backdropColor="black"
          onBackdropPress={() => setModalVisible(false)}
          style={styles.modal}
          onBackButtonPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text>Hello World</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Close Modal</Text>
            </Pressable>
            <Button
              title="profile"
              onPress={() => {
                navigation.navigate("Profile");
                setModalVisible(false);
              }}
            />
            <Button
              title="search"
              onPress={() => {
                navigation.navigate("Search");
                setModalVisible(false);
              }}
            />
            <Button
              title="home"
              onPress={() => {
                navigation.navigate("Home");
                setModalVisible(false);
              }}
            />
            <Button
              title="Bookmarks"
              onPress={() => {
                navigation.navigate("Bookmarks");
                setModalVisible(false);
              }}
            />
            <Pressable
              onPress={toggleTheme}
              style={{
                marginTop: 20,
                padding: 10,
                backgroundColor: theme[current].text,
              }}
            >
              <Text style={{ color: "#ffffff" }}>Toggle Theme</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modal: {
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "60%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default Modal_custom;
