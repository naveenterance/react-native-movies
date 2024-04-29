import LottieView from "lottie-react-native";

const Loader = ({ height, width }) => {
  return (
    <LottieView
      style={{
        width: width,
        height: height,
        alignSelf: "center",
      }}
      source={require("../assets/loader4.json")}
      autoPlay
      loop
    />
  );
};

export default Loader;
