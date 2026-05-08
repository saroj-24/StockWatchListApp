import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  data: number[];
  labels: string[];
  width: number;
  height: number;
  color?: string;
}

export const SimpleBarChart: React.FC<Props> = ({ data, labels, width, height, color }) => {
  const { theme } = useTheme();
  const barColor = color || theme.chartLine;
  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 40;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const { bars } = useMemo(() => {
    const max = Math.max(...data) || 1;
    const gap = 4;
    const barWidth = (chartWidth / data.length) - gap;
    const bs = data.map((val, i) => ({
      x: paddingLeft + i * (chartWidth / data.length) + gap / 2,
      y: paddingTop + chartHeight - (val / max) * chartHeight,
      width: barWidth,
      height: (val / max) * chartHeight,
    }));
    return { bars: bs };
  }, [data, chartWidth, chartHeight]);

  const labelStep = Math.ceil(labels.length / 5);
  const visibleIndices = labels.map((_, i) => i).filter(i => i % labelStep === 0 || i === labels.length - 1);

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={barColor} stopOpacity="1" />
            <Stop offset="1" stopColor={barColor} stopOpacity="0.5" />
          </LinearGradient>
        </Defs>
        {bars.map((bar, i) => (
          <Rect
            key={i}
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            fill="url(#barGrad)"
            rx="3"
          />
        ))}
      </Svg>
      <View style={[styles.labelsRow, { paddingHorizontal: paddingLeft }]}>
        {visibleIndices.map(i => (
          <Text
            key={i}
            style={[styles.label, {
              color: theme.textMuted,
              left: bars[i]?.x - paddingLeft - 14,
            }]}
          >
            {labels[i]}
          </Text>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  labelsRow: {
    flexDirection: 'row',
    position: 'relative',
    height: 18,
  },
  label: {
    position: 'absolute',
    fontSize: 10,
    width: 40,
    textAlign: 'center',
  },
});