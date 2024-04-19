import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Pressable } from "react-native";
import Modal from "react-native-modal";
import { Platform, BackHandler } from "react-native";

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
        BackHandler.exitApp();
      }),
    [navigation]
  );

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
        >
          <View style={styles.modalContent}>
            <Text>Hello World</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Close Modal</Text>
            </Pressable>
          </View>
        </Modal>

        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable>
      </View>
      <View
        style={{
          height: 50,
          backgroundColor: "#E5E7EB",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Text>Takumi</Text>
        <Button
          title="Profile"
          onPress={() => navigation.navigate("Profile")}
        />
        <Button title="Search" onPress={() => navigation.navigate("Search")} />
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

export default HomeScreen;
