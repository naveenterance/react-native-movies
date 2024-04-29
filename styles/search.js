import { StyleSheet } from "react-native";
export const styles_search = StyleSheet.create({
  renderItems: {
    container: {
      margin: 8,
      padding: 8,
      borderRadius: 8,
      flexDirection: "row",
    },
  },
  ratingsBar: {
    container: { width: "100%", borderRadius: 999, height: 4 },
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
  searchBar: {
    width: "80%",
    marginTop: "1%",
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    borderWidth: 2,
    borderRadius: 999,
    fontSize: 16,
    marginHorizontal: "2%",
  },
});
