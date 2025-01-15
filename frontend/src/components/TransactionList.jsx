import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const [dateFilter, setDateFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const dateMatch = !dateFilter || new Date(transaction.date).toDateString() === dateFilter.toDateString();
    const typeMatch = typeFilter === 'all' || transaction.type === typeFilter;
    return dateMatch && typeMatch;
  });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '16px', display: 'flex', gap: '16px' }}>
        <DatePicker
          label="Filter by date"
          value={dateFilter}
          onChange={setDateFilter}
          renderInput={(params) => <TextField {...params} />}
        />
        <TextField
          select
          label="Transaction Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
      </div>
      
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type}
                    color={transaction.type === 'income' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{transaction.category.name}</TableCell>
                <TableCell>
                  {transaction.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: transaction.wallet.currency,
                  })}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(transaction)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(transaction._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TransactionList;
