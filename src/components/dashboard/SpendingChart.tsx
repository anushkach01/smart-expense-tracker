import React, { useMemo } from 'react';
import {
  Card,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import useAppSelector from '../../hooks/useAppSelector';
import { selectExpenses } from '../../features/expenses/expenseSlice';
import { calculateCategoryData } from '../../utils/calculateStats';
import { PIE_CHART_COLORS, getCategoryConfig } from '../../utils/categoryConfig';
import { formatCurrency } from '../../utils/formatCurrency';

const SpendingChart: React.FC = React.memo(() => {
  const theme = useTheme();
  const expenses = useAppSelector(selectExpenses);

  const chartData = useMemo(
    () => calculateCategoryData(expenses),
    [expenses]
  );

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (value < 5) return null;
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${value}%`}
      </text>
    );
  };

  return (
    <Card sx={{ p: 2.5, height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Spending by Category
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        {/* Pie Chart */}
        <Box sx={{ flex: 1, height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any, ...rest: any[]) => [
                  `${value}%`,
                  name,
                ]}
                contentStyle={{
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 1,
            minWidth: 160,
          }}
        >
          {chartData.map((item, index) => {
            const config = getCategoryConfig(item.name);
            return (
              <Box
                key={item.name}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {item.name}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.primary">
                  {formatCurrency(item.amount)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Card>
  );
});

SpendingChart.displayName = 'SpendingChart';

export default SpendingChart;