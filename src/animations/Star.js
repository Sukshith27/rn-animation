import React, { useCallback } from 'react';
import { TouchableWithoutFeedback, Animated, Easing } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { sequence, useAnimatedValue, parallel } from './utils';

export default ({ starFilled, onPress }) => {
  const scale = useAnimatedValue(1);
  const rotate = useAnimatedValue(0);

  const animatePressIn = useCallback(() => {
    Animated.timing(scale, {
      toValue: 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const animatePressOut = useCallback(() => {
    sequence([
      Animated.timing(scale, {
        toValue: 2,
        duration: 100,
        useNativeDriver: true,
      }),
    ])(() =>
      parallel([
        Animated.timing(rotate, {
          toValue: 1,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ])(),
    );
  }, [rotate, scale]);

  /**
   * Expectd animation:
   * > The total animation time should not be more than 300ms
   * 1. On press-in: Scale down the star
   * 2. On press-out: Scale up the star to ~1.8
   * 3. Slowly rotate the star. Doesn't have to be 360deg rotation
   * 4. Simultaneously, scale down the star and complete the 360deg rotation
   */

  const onPressIn = () => {
    onPress();
    animatePressIn();
  };

  const onPressOut = () => {
    animatePressOut();
  };

  return (
    <Animated.View
      style={{
        transform: [
          { scale },
          {
            rotate: rotate.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      }}
    >
      <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
        <Icon
          name={starFilled ? 'star' : 'star-o'}
          size={60}
          color="#FFD700"
          style={{ margin: 5 }}
        />
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};
