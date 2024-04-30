import { StyleSheet, ViewStyle, TextStyle } from "react-native";
interface Styles {
  renderItems_container: ViewStyle;
  ratingBar_container: ViewStyle;
  bar: ViewStyle;
}
export const styles_bookmarks = StyleSheet.create<Styles>({
  renderItems_container: {
    margin: 8,
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
  },

  ratingBar_container: {
    width: "100%",
    borderRadius: 999,
    height: 4,
  },
  bar: {
    alignItems: "center",
    padding: 2,
    borderRadius: 999,
    // fontSize: 10,
    // fontWeight: "500",
    // textAlign: "center",
    // lineHeight: 10,
  },
});
