import { useRef } from "react";
import { Animated } from "react-native";

const usePressAnimation = (callback: any) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const animateButton = () => {
    Animated.timing(scaleValue, {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        if (callback) {
          callback();
        }
      });
    });
  };

  const onPressHandler = () => {
    animateButton();
  };

  return [onPressHandler, scaleValue];
};

export default usePressAnimation;
