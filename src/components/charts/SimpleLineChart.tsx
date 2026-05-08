import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  data: number[];
  labels: string[];
  width: number;
  height: number;
  color?: string;
}

export const SimpleLineChart: React.FC<Props> = ({ data, labels, width, height, color }) => {
  const { theme } = useTheme();
  const lineColor = color || theme.chartLine;
  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 40;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const { linePath, areaPath, points, minVal, maxVal } = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((val, i) => ({
      x: paddingLeft + (i / (data.length - 1)) * chartWidth,
      y: paddingTop + (1 - (val - min) / range) * chartHeight,
    }));
    let lp = '';
    let ap = '';
    pts.forEach((p, i) => {
      if (i === 0) {
        lp = `M ${p.x} ${p.y}`;
        ap = `M ${p.x} ${paddingTop + chartHeight} L ${p.x} ${p.y}`;
      } else {
        const prev = pts[i - 1];
        const cpx = (prev.x + p.x) / 2;
        lp += ` C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
        ap += ` C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
      }
    });
    const last = pts[pts.length - 1];
    ap += ` L ${last.x} ${paddingTop + chartHeight} Z`;
    return { linePath: lp, areaPath: ap, points: pts, minVal: min, maxVal: max };
  }, [data, chartWidth, chartHeight]);

  const labelStep = Math.ceil(labels.length / 6);
  const visibleLabels = labels.filter((_, i) => i % labelStep === 0 || i === labels.length - 1);
  const visiblePoints = points.filter((_, i) => i % labelStep === 0 || i === points.length - 1);

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={lineColor} stopOpacity="0.3" />
            <Stop offset="1" stopColor={lineColor} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <Line
            key={i}
            x1={paddingLeft}
            y1={paddingTop + t * chartHeight}
            x2={paddingLeft + chartWidth}
            y2={paddingTop + t * chartHeight}
            stroke={theme.chartGrid}
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        ))}
        {/* Area fill */}
        <Path d={areaPath} fill="url(#areaGrad)" />
        {/* Line */}
        <Path d={linePath} stroke={lineColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* End dot */}
        <Circle cx={points[points.length - 1]?.x} cy={points[points.length - 1]?.y} r="5" fill={lineColor} />
        <Circle cx={points[points.length - 1]?.x} cy={points[points.length - 1]?.y} r="9" fill={lineColor} fillOpacity="0.2" />
      </Svg>
      {/* X-axis labels */}
      <View style={[styles.labelsRow, { paddingHorizontal: paddingLeft }]}>
        {visibleLabels.map((label, i) => (
          <Text key={i} style={[styles.label, { color: theme.textMuted, left: visiblePoints[i]?.x - paddingLeft - 18 }]}>
            {label}
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