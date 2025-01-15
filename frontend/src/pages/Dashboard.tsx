import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
  Button,
  Alert,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import { motion, Box as MotionBox } from 'framer-motion';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { useAuth } from '../contexts/AuthContext';
import { transactionsAPI, categoriesAPI } from '../services/api';
import type { Account, Transaction, Budget, Category } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useNotification } from '../contexts/NotificationContext';

interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  categories: Category[];
  categoryBreakdown: {
    id: string;
    label: string;
    value: number;
    color: string;
  }[];
  trendData: {
    income: { x: string; y: number }[];
    expense: { x: string; y: number }[];
  };
}

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    transactions: [],
    accounts: [],
    budgets: [],
    categories: [],
    categoryBreakdown: [],
    trendData: {
      income: [],
      expense: []
    }
  });

  const handleError = (error: any) => {
    console.error('Dashboard error:', error);
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    setError(message);
    showNotification('error', message);
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data
      const [transactionsRes, categoriesRes] = await Promise.all([
        transactionsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);

      const transactions = transactionsRes.data;
      const categories = categoriesRes.data;

      // Process category breakdown
      const categoryBreakdown = categories.map((category: Category) => ({
        id: category.name,
        label: category.name,
        value: transactions
          .filter((t: Transaction) => t.category === category._id)
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
        color: category.color,
      })).filter((c: { value: number }) => c.value > 0);

      // Process trend data
      const last3Months = Array.from({ length: 3 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString('default', { month: 'short' });
      }).reverse();

      const trendData = {
        income: last3Months.map(month => ({
          x: month,
          y: transactions
            .filter((t: Transaction) => 
              t.type === 'income' &&
              new Date(t.date).toLocaleString('default', { month: 'short' }) === month
            )
            .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
        })),
        expense: last3Months.map(month => ({
          x: month,
          y: transactions
            .filter((t: Transaction) => 
              t.type === 'expense' &&
              new Date(t.date).toLocaleString('default', { month: 'short' }) === month
            )
            .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
        })),
      };

      setSummary({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        transactions,
        accounts: [],
        budgets: [],
        categories,
        categoryBreakdown,
        trendData,
      });

      // Check budget notifications
      summary.budgets.forEach((budget: Budget) => {
        const percentage = (budget.spent / budget.limit) * 100;
        if (percentage >= budget.notificationThreshold) {
          const category = typeof budget.category === 'string' 
            ? summary.categories.find((c: Category) => c._id === budget.category) 
            : budget.category;
          
          if (!category) return;
          
          showNotification(
            'warning',
            `Budget Alert: ${category.name} is at ${percentage.toFixed(1)}% of limit`
          );
        }
      });

    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading your financial summary...
        </Typography>
      </Box>
    );
  }

  const MotionCard = motion(Card);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your financial summary
          </Typography>
        </Box>
        <IconButton onClick={handleRefresh} disabled={loading}>
          <RefreshIcon fontSize="medium" />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Total Balance Card */}
        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            sx={{
              p: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Total Balance</Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon fontSize="small" />}
                onClick={() => window.location.href = '/accounts'}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                Add Account
              </Button>
            </Box>
            <Typography variant="h3" sx={{ my: 2 }}>
              {formatCurrency(summary.totalBalance)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {summary.accounts.length} active account{summary.accounts.length !== 1 ? 's' : ''}
            </Typography>
          </MotionCard>
        </Grid>

        {/* Monthly Summary Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <MotionCard
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                sx={{ p: 3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 'medium', color: 'success.main' }} />
                  <Typography variant="h6" sx={{ ml: 1 }}>Monthly Income</Typography>
                </Box>
                <Typography variant="h4" gutterBottom>
                  {formatCurrency(summary.monthlyIncome)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This month's earnings
                </Typography>
              </MotionCard>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MotionCard
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                sx={{ p: 3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingDownIcon sx={{ fontSize: 'medium', color: 'error.main' }} />
                  <Typography variant="h6" sx={{ ml: 1 }}>Monthly Expenses</Typography>
                </Box>
                <Typography variant="h4" gutterBottom>
                  {formatCurrency(summary.monthlyExpenses)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This month's spending
                </Typography>
              </MotionCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Budget Progress */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Budget Progress
            </Typography>
            <Grid container spacing={2}>
              {summary.budgets.map((budget) => (
                <Grid item xs={12} key={budget._id}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{typeof budget.category === 'string' 
                        ? summary.categories.find((c: Category) => c._id === budget.category)?.name 
                        : budget.category.name}</Typography>
                      <Typography variant="body2">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((budget.spent / budget.limit) * 100, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: typeof budget.category === 'string'
                            ? summary.categories.find((c: Category) => c._id === budget.category)?.color
                            : budget.category.color,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Income vs Expenses
            </Typography>
            <Box sx={{ height: 300 }}>
              {summary.trendData.income.length > 0 && summary.trendData.expense.length > 0 ? (
                <ResponsiveLine
                  data={[
                    {
                      id: 'Income',
                      color: theme.palette.success.main,
                      data: summary.trendData.income,
                    },
                    {
                      id: 'Expenses',
                      color: theme.palette.error.main,
                      data: summary.trendData.expense,
                    },
                  ]}
                  margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  curve="monotoneX"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: (value) => formatCurrency(value as number),
                  }}
                  enablePoints={true}
                  pointSize={8}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  enableArea={true}
                  areaOpacity={0.1}
                  useMesh={true}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 50,
                      itemsSpacing: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 80,
                      itemHeight: 20,
                      symbolSize: 12,
                      symbolShape: 'circle',
                    },
                  ]}
                  theme={{
                    axis: {
                      ticks: {
                        text: {
                          fill: theme.palette.text.secondary,
                        },
                      },
                    },
                    grid: {
                      line: {
                        stroke: theme.palette.divider,
                      },
                    },
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    No trend data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Expense Breakdown
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsivePie
                data={summary.categoryBreakdown}
                margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ datum: 'data.color' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={theme.palette.text.primary}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                legends={[
                  {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 50,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: theme.palette.text.secondary,
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                  },
                ]}
              />
            </Box>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <Box>
              {summary.transactions.slice(0, 5).map((transaction) => (
                <Box
                  key={transaction._id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box>
                    <Typography variant="body1">{transaction.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(transaction.date).toLocaleDateString()} • {
                        typeof transaction.category === 'object' ? transaction.category.name : ''
                      }
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color:
                        transaction.type === 'income'
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{' '}
                    {formatCurrency(transaction.amount)}
                  </Typography>
                </Box>
              ))}
              {summary.transactions.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No recent transactions
                </Typography>
              )}
              {summary.transactions.length > 0 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={() => window.location.href = '/transactions'}
                  >
                    View All Transactions
                  </Button>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
