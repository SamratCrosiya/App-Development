// src/components/ui/Chart.tsx
// React Native port of chart.tsx
// recharts → react-native-svg based bar, line, and pie charts
// Install: npx expo install react-native-svg

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Rect, Line, Circle, Path, G, Text as SvgText } from 'react-native-svg';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
  };
}

interface ChartContainerProps {
  config: ChartConfig;
  children: React.ReactNode;
  style?: ViewStyle;
  height?: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ChartContext = React.createContext<{ config: ChartConfig }>({ config: {} });

// ─── ChartContainer ───────────────────────────────────────────────────────────

const ChartContainer = ({ config, children, style, height = 200 }: ChartContainerProps) => (
  <ChartContext.Provider value={{ config }}>
    <View style={[{ height }, style]}>{children}</View>
  </ChartContext.Provider>
);

// ─── BarChart ─────────────────────────────────────────────────────────────────

export interface DataPoint {
  label: string;
  [key: string]: string | number;
}

interface BarChartProps {
  data: DataPoint[];
  dataKey: string;
  color?: string;
  height?: number;
  width?: number;
  showGrid?: boolean;
  showLabels?: boolean;
}

const BarChart = ({
  data,
  dataKey,
  color,
  height = 200,
  width = 300,
  showGrid = true,
  showLabels = true,
}: BarChartProps) => {
  const { config } = React.useContext(ChartContext);
  const barColor = color ?? config[dataKey]?.color ?? COLORS.primary;

  const values = data.map((d) => Number(d[dataKey]) || 0);
  const maxVal = Math.max(...values, 1);
  const padL = 32, padR = 8, padT = 12, padB = 32;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const barW = (chartW / data.length) * 0.55;
  const gap = chartW / data.length;

  return (
    <Svg width={width} height={height}>
      {/* Grid lines */}
      {showGrid && [0.25, 0.5, 0.75, 1].map((pct) => {
        const y = padT + chartH * (1 - pct);
        return (
          <Line key={pct} x1={padL} y1={y} x2={width - padR} y2={y}
            stroke={COLORS.border} strokeWidth={1} strokeDasharray="4 3" />
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const val = Number(d[dataKey]) || 0;
        const barH = (val / maxVal) * chartH;
        const x = padL + gap * i + (gap - barW) / 2;
        const y = padT + chartH - barH;
        return (
          <G key={i}>
            <Rect x={x} y={y} width={barW} height={barH}
              fill={barColor} rx={3} opacity={0.9} />
            {showLabels && (
              <SvgText x={x + barW / 2} y={height - padB + 14}
                fontSize={10} fill={COLORS.muted} textAnchor="middle">
                {d.label}
              </SvgText>
            )}
          </G>
        );
      })}
      {/* Y axis */}
      <Line x1={padL} y1={padT} x2={padL} y2={padT + chartH}
        stroke={COLORS.border} strokeWidth={1} />
    </Svg>
  );
};

// ─── LineChart ────────────────────────────────────────────────────────────────

interface LineChartProps {
  data: DataPoint[];
  dataKey: string;
  color?: string;
  height?: number;
  width?: number;
  showDots?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  curved?: boolean;
}

const LineChart = ({
  data,
  dataKey,
  color,
  height = 200,
  width = 300,
  showDots = true,
  showGrid = true,
  showLabels = true,
}: LineChartProps) => {
  const { config } = React.useContext(ChartContext);
  const lineColor = color ?? config[dataKey]?.color ?? COLORS.primary;

  const values = data.map((d) => Number(d[dataKey]) || 0);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;
  const padL = 32, padR = 8, padT = 12, padB = 32;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const stepX = chartW / Math.max(data.length - 1, 1);

  const pts = values.map((v, i) => ({
    x: padL + i * stepX,
    y: padT + chartH - ((v - minVal) / range) * chartH,
  }));

  const pathD = pts.reduce(
    (acc, p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`),
    ''
  );

  return (
    <Svg width={width} height={height}>
      {showGrid && [0.25, 0.5, 0.75, 1].map((pct) => {
        const y = padT + chartH * (1 - pct);
        return (
          <Line key={pct} x1={padL} y1={y} x2={width - padR} y2={y}
            stroke={COLORS.border} strokeWidth={1} strokeDasharray="4 3" />
        );
      })}
      <Path d={pathD} fill="none" stroke={lineColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {showDots && pts.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={4}
          fill={lineColor} stroke={COLORS.card} strokeWidth={2} />
      ))}
      {showLabels && data.map((d, i) => (
        <SvgText key={i} x={pts[i].x} y={height - padB + 14}
          fontSize={10} fill={COLORS.muted} textAnchor="middle">
          {d.label}
        </SvgText>
      ))}
      <Line x1={padL} y1={padT} x2={padL} y2={padT + chartH}
        stroke={COLORS.border} strokeWidth={1} />
    </Svg>
  );
};

// ─── PieChart ─────────────────────────────────────────────────────────────────

export interface PieSlice {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieSlice[];
  size?: number;
  innerRadius?: number;  // 0 = pie, >0 = donut
  showLegend?: boolean;
}

const PIE_COLORS = [COLORS.primary, '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

const PieChart = ({ data, size = 200, innerRadius = 0, showLegend = true }: PieChartProps) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 8;

  let startAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const end = startAngle + angle;
    const slice = { ...d, startAngle, endAngle: end, color: d.color ?? PIE_COLORS[i % PIE_COLORS.length] };
    startAngle = end;
    return slice;
  });

  const arc = (sa: number, ea: number, outerR: number, innerR: number) => {
    const x1 = cx + outerR * Math.cos(sa), y1 = cy + outerR * Math.sin(sa);
    const x2 = cx + outerR * Math.cos(ea), y2 = cy + outerR * Math.sin(ea);
    const large = ea - sa > Math.PI ? 1 : 0;
    if (innerR === 0) {
      return `M${cx},${cy} L${x1},${y1} A${outerR},${outerR} 0 ${large} 1 ${x2},${y2} Z`;
    }
    const ix1 = cx + innerR * Math.cos(ea), iy1 = cy + innerR * Math.sin(ea);
    const ix2 = cx + innerR * Math.cos(sa), iy2 = cy + innerR * Math.sin(sa);
    return `M${x1},${y1} A${outerR},${outerR} 0 ${large} 1 ${x2},${y2} L${ix1},${iy1} A${innerR},${innerR} 0 ${large} 0 ${ix2},${iy2} Z`;
  };

  return (
    <View>
      <Svg width={size} height={size}>
        {slices.map((s, i) => (
          <Path key={i} d={arc(s.startAngle, s.endAngle, r, innerRadius)}
            fill={s.color} opacity={0.9} />
        ))}
      </Svg>
      {showLegend && (
        <View style={legendStyles.row}>
          {slices.map((s, i) => (
            <View key={i} style={legendStyles.item}>
              <View style={[legendStyles.dot, { backgroundColor: s.color }]} />
              <Text style={legendStyles.label}>{s.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── ChartTooltip (simplified — shows as Text overlay) ───────────────────────

const ChartTooltip = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
  <View style={tooltipStyles.box}>
    {color && <View style={[tooltipStyles.indicator, { backgroundColor: color }]} />}
    <Text style={tooltipStyles.label}>{label}: </Text>
    <Text style={tooltipStyles.value}>{value}</Text>
  </View>
);

// ─── ChartLegend ─────────────────────────────────────────────────────────────

interface ChartLegendProps {
  items: Array<{ label: string; color: string }>;
  style?: ViewStyle;
}

const ChartLegend = ({ items, style }: ChartLegendProps) => (
  <View style={[legendStyles.row, style]}>
    {items.map((item, i) => (
      <View key={i} style={legendStyles.item}>
        <View style={[legendStyles.dot, { backgroundColor: item.color }]} />
        <Text style={legendStyles.label}>{item.label}</Text>
      </View>
    ))}
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const legendStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    color: COLORS.mutedForeground,
  },
});

const tooltipStyles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: 5,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  label: { fontSize: 12, color: COLORS.mutedForeground },
  value: { fontSize: 12, fontWeight: '700', color: COLORS.foreground },
});

export {
  ChartContainer,
  BarChart,
  LineChart,
  PieChart,
  ChartTooltip,
  ChartLegend,
};
