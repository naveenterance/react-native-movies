import { StyleSheet } from "react-native";
export const styles_movie_info = StyleSheet.create({
  progress: {
    container: {
      flexDirection: "row",
      alignContent: "center",
      alignItems: "center",
      width: "100%",
      marginVertical: "15%",
      marginHorizontal: "5%",
    },
    bar: {
      width: "20%",
      height: "1%",
      alignItems: "center",
      padding: 2,
      borderRadius: 999,
      fontSize: 16,
      fontWeight: 500,
      textAlign: "center",
      lineHeight: 12,
      marginBottom: "3%",
    },
  },
  textInput: {
    rating: {
      borderWidth: 4,
      borderRadius: 8,
      width: "15%",
      padding: 8,
      marginLeft: "10%",
      fontSize: 20,
      fontWeight: "600",
    },
    review: {
      borderWidth: 4,
      padding: 10,
      fontSize: 14,
      textAlignVertical: "top",
      borderRadius: 8,
    },
  },
});
