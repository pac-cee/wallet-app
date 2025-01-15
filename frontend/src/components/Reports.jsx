import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Reports = ({ transactions }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState('summary');

  const filteredTransactions = transactions.filter(transaction => {
    if (!startDate || !endDate) return true;
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  const generateSummaryData = () => {
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      categoryExpenses: {},
      dailyTransactions: {},
    };

    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        summary.totalIncome += transaction.amount;
      } else {
        summary.totalExpense += transaction.amount;
        summary.categoryExpenses[transaction.category.name] = 
          (summary.categoryExpenses[transaction.category.name] || 0) + transaction.amount;
      }

      const date = new Date(transaction.date).toLocaleDateString();
      if (!summary.dailyTransactions[date]) {
        summary.dailyTransactions[date] = { income: 0, expense: 0 };
      }
      summary.dailyTransactions[date][transaction.type] += transaction.amount;
    });

    return summary;
  };

  const summary = generateSummaryData();

  const exportReport = () => {
    const reportData = {
      reportType,
      dateRange: { startDate, endDate },
      summary,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" gap={2} mb={3}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <TextField
              select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="summary">Summary</MenuItem>
              <MenuItem value="category">Category Analysis</MenuItem>
              <MenuItem value="daily">Daily Transactions</MenuItem>
            </TextField>
            <Button variant="contained" onClick={exportReport}>
              Export Report
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Income vs Expense
          </Typography>
          <BarChart width={500} height={300} data={[
            { name: 'Income', amount: summary.totalIncome },
            { name: 'Expense', amount: summary.totalExpense },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Expense by Category
          </Typography>
          <PieChart width={500} height={300}>
            <Pie
              data={Object.entries(summary.categoryExpenses).map(([name, value]) => ({
                name,
                value,
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {Object.entries(summary.categoryExpenses).map((entry, index) => (
                <Cell key={index} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Reports;
