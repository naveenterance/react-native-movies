import { StyleSheet, ViewStyle, TextStyle } from "react-native";

interface Styles {
  progress_container: ViewStyle;
  bar: ViewStyle;
  textInput_rating: TextStyle;
  textInput_review: TextStyle;
}
export const styles_movie_info = StyleSheet.create<Styles>({
  progress_container: {
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
    // fontSize: 16,
    // fontWeight: "500",
    // textAlign: "center",
    // lineHeight: 12,
    marginBottom: "3%",
  },

  textInput_rating: {
    borderWidth: 4,
    borderRadius: 8,
    width: "15%",
    padding: 8,
    marginLeft: "10%",
    fontSize: 20,
    fontWeight: "600",
  },
  textInput_review: {
    borderWidth: 4,
    padding: 10,
    fontSize: 14,
    textAlignVertical: "top",
    borderRadius: 8,
  },
});
