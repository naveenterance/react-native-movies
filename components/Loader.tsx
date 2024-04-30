import * as React from "react";
import LottieView from "lottie-react-native";

interface LoaderProps {
  height: number;
  width: number;
}

const Loader: React.FC<LoaderProps> = ({ height, width }) => {
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
