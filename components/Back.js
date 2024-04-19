import { useEffect } from "react";
import { Platform, BackHandler } from "react-native";
import Toast from "react-native-simple-toast";

let currentCount = 0;
let subscription;

const useDoubleBackPressExit = (isEnabled) => {
  useEffect(() => {
    const backPressListener = () => {
      if (currentCount === 1) {
        BackHandler.exitApp();
        if (subscription) {
          subscription.remove();
        }
        return true;
      }
      backPressHandler();
      return true;
    };

    if (Platform.OS === "android" && isEnabled) {
      subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backPressListener
      );

      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    }
  }, [isEnabled]);
};

const backPressHandler = () => {
  if (currentCount < 1) {
    currentCount += 1;
    Toast.show("Press again to exit.", Toast.LONG);
  }
  setTimeout(() => {
    currentCount = 0;
  }, 2000);
};

export default useDoubleBackPressExit;
