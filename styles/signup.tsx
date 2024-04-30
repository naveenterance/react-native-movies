import { StyleSheet, ViewStyle, TextStyle } from "react-native";

interface Styles {
  Modal: ViewStyle;
  Modal_View: ViewStyle;
  Modal_Text: TextStyle;
  TextInput: TextStyle;
  Text: TextStyle;
  PasswordBar: TextStyle;
}
export const styles_signup = StyleSheet.create<Styles>({
  Modal: {
    flex: 1,
    maxHeight: "30%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "50%",
    borderRadius: 20,
  },
  Modal_View: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  Modal_Text: { fontSize: 22, margin: 10, fontWeight: "bold" },

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
  PasswordBar: {
    height: 10,
    alignItems: "center",
    padding: 2,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 10,
  },
});
