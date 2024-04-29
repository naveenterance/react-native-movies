import { StyleSheet } from "react-native";
export const styles_signup = StyleSheet.create({
  Modal: {
    flex: 1,
    maxHeight: "30%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "50%",
    borderRadius: 20,
    View: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    Text: { fontSize: 22, margin: 10, fontWeight: "bold" },
  },
  TextInput: {
    borderBottomWidth: 4,
    padding: 16,
    borderRadius: 16,
    width: "75%",
    marginBottom: 16,
    fontSize: 16,
  },
  Text: {
    fontSize: 36,
    paddingHorizontal: "10%",
    paddingVertical: "20%",
    fontWeight: "bold",
  },
});
