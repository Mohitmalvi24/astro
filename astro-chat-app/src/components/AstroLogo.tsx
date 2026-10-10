import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../theme/theme';

export const AstroLogo = ({ size = 48 }: { size?: number }) => {
  const strokeWidth = size * 0.05;
  const center = size / 2;
  const radius = size * 0.38;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Simple line-art orbit ring */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.accent}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Star dot 1 */}
        <Circle
          cx={center + radius * 0.7}
          cy={center - radius * 0.5}
          r={size * 0.04}
          fill={theme.colors.accent}
        />
        {/* Star dot 2 */}
        <Circle
          cx={center - radius * 0.8}
          cy={center + radius * 0.4}
          r={size * 0.03}
          fill={theme.colors.accent}
        />
      </Svg>
    </View>
  );
};
