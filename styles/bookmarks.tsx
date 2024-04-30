import { StyleSheet } from "react-native";
export const styles_bookmarks = StyleSheet.create({
  renderItems: {
    container: {
      margin: 8,
      padding: 8,
      borderRadius: 8,
      flexDirection: "row",
    },
  },
  ratingBar: {
    container: {
      width: "100%",
      borderRadius: 999,
      height: 4,
    },
    bar: {
      alignItems: "center",
      padding: 2,
      borderRadius: 999,
      fontSize: 10,
      fontWeight: "500",
      textAlign: "center",
      lineHeight: 10,
    },
  },
});
