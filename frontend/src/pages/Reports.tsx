import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  MenuItem,
  Button,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import {
  Download as DownloadIcon,
  TrendingUp,
  TrendingDown,
  AccountBalance,
} from '@mui/icons-material';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Reports: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('monthly');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateDateRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (start > end) {
      setError('Start date cannot be after end date');
      return false;
    }

    if (end > today) {
      setError('End date cannot be in the future');
      return false;
    }

    if (start < new Date('2000-01-01')) {
      setError('Start date cannot be before year 2000');
      return false;
    }

    // Calculate date difference in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      setError('Date range cannot exceed one year');
      return false;
    }

    setError('');
    return true;
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setError('');
  };

  const handleExportReport = async () => {
    if (!validateDateRange()) return;

    try {
      setLoading(true);
      // Call your API to generate report
      // const response = await reportsAPI.export({
      //   startDate,
      //   endDate,
      //   account: selectedAccount,
      //   category: selectedCategory,
      // });
      
      // Create and download file
      // const blob = new Blob([response.data], { type: 'application/pdf' });
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `financial-report-${startDate}-to-${endDate}.pdf`;
      // link.click();
    } catch (err: any) {
      console.error('Failed to export report:', err);
      setError('Failed to export report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sample data
  const incomeVsExpenseData = [
    {
      id: 'income',
      data: [
        { x: 'Jan', y: 3000 },
        { x: 'Feb', y: 3200 },
        { x: 'Mar', y: 2800 },
        { x: 'Apr', y: 3500 },
        { x: 'May', y: 3100 },
        { x: 'Jun', y: 3800 },
      ],
    },
    {
      id: 'expense',
      data: [
        { x: 'Jan', y: 2000 },
        { x: 'Feb', y: 2100 },
        { x: 'Mar', y: 1900 },
        { x: 'Apr', y: 2300 },
        { x: 'May', y: 2000 },
        { x: 'Jun', y: 2400 },
      ],
    },
  ];

  const categoryData = [
    { id: 'Shopping', value: 30 },
    { id: 'Transport', value: 20 },
    { id: 'Food', value: 25 },
    { id: 'Entertainment', value: 15 },
    { id: 'Others', value: 10 },
  ];

  const accountBalanceData = [
    {
      account: 'Main Bank',
      balance: 5000,
    },
    {
      account: 'Mobile Money',
      balance: 1200,
    },
    {
      account: 'Cash',
      balance: 300,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Reports</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportReport}
          disabled={loading}
        >
          {loading ? 'Exporting...' : 'Export Report'}
        </Button>
      </Box>

      <MotionCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        sx={{ mb: 3 }}
      >
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange('start', e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            error={!!error}
            helperText={error}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange('end', e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            error={!!error}
            helperText={error}
          />
          <TextField
            select
            label="Account"
            size="small"
            sx={{ minWidth: 150 }}
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <MenuItem value="all">All Accounts</MenuItem>
            <MenuItem value="bank">Main Bank</MenuItem>
            <MenuItem value="mobile">Mobile Money</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
          </TextField>
          <TextField
            select
            label="Category"
            size="small"
            sx={{ minWidth: 150 }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="shopping">Shopping</MenuItem>
            <MenuItem value="transport">Transport</MenuItem>
            <MenuItem value="food">Food</MenuItem>
          </TextField>
        </Box>
      </MotionCard>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Overview" />
        <Tab label="Income vs Expense" />
        <Tab label="Category Analysis" />
        <Tab label="Account Balances" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ p: 3, height: '100%' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Income</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                $19,400
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                +12% from last period
              </Typography>
            </MotionCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              sx={{ p: 3, height: '100%' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Expenses</Typography>
              </Box>
              <Typography variant="h3" color="error.main">
                $12,700
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                -5% from last period
              </Typography>
            </MotionCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              sx={{ p: 3, height: '100%' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Net Balance</Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                $6,700
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                +35% from last period
              </Typography>
            </MotionCard>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <MotionCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          sx={{ height: 400 }}
        >
          <ResponsiveLine
            data={incomeVsExpenseData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
            curve="cardinal"
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
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </MotionCard>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <MotionCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          sx={{ height: 400 }}
        >
          <ResponsivePie
            data={categoryData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
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
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: theme.palette.text.primary,
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
              },
            ]}
          />
        </MotionCard>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <MotionCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          sx={{ height: 400 }}
        >
          <ResponsiveBar
            data={accountBalanceData}
            keys={['balance']}
            indexBy="account"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
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
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </MotionCard>
      </TabPanel>
    </Box>
  );
};

export default Reports;
