# 💰 TASKforce Wallet App

A comprehensive, full-stack personal finance management application with powerful features for tracking expenses, managing multiple accounts, and visualizing your financial journey.

## 🌐 Live App
- Frontend: https://wallet-app-frontend-cxal.onrender.com
- Backend API: https://wallet-app-backend-bj9j.onrender.com/api

## 📚 Table of Contents
- [Features](#-features)
- [Coming Soon](#-coming-soon)
- [Technical Stack](#-technical-stack)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🌟 Features

### Core Features
- 💳 **Smart Account Management**
  - Create and manage multiple accounts (bank, cash, mobile money)
  - Support for multiple currencies
  - Real-time balance tracking
  - Account-wise transaction history

- 📊 **Intelligent Transaction Tracking**
  - Easy income and expense logging
  - Smart categorization
  - Detailed transaction history
  - Quick transaction search and filtering
  - Test transactions for demo purposes

- 🎯 **Category Management**
  - Default categories for quick setup
  - Custom category creation
  - Color coding for better visualization
  - Category-wise transaction analysis

- 📈 **Analytics & Reports**
  - Interactive dashboard
  - Expense patterns visualization
  - Income vs expense analysis
  - Category-wise breakdown
  - Custom date range reports

### Additional Features
- 🌙 Dark/Light theme support
- 📱 Responsive design for all devices
- 🔐 Secure authentication system
- 🔄 Real-time updates
- 📤 Data export functionality

## 🚀 Coming Soon

### Planned Features
- 🏦 **Direct Bank Integration**
  - Real-time bank account balance sync
  - Automatic transaction import
  - Support for major banks
  - Secure bank API integration

- 📱 **Mobile Money Integration**
  - M-Pesa integration
  - Automatic balance updates
  - Transaction history sync
  - Mobile money transfer tracking

- 💡 **Smart Features**
  - AI-powered expense predictions
  - Automated categorization
  - Smart savings recommendations
  - Investment tracking
  - Bill payment reminders

- 🔔 **Enhanced Notifications**
  - Custom alert thresholds
  - Budget overspending warnings
  - Bill payment reminders
  - Unusual activity detection

- 📊 **Advanced Analytics**
  - Predictive analysis
  - Custom report generation
  - Financial goal tracking
  - Investment portfolio analysis
  - Net worth tracking

- 🤝 **Social Features**
  - Shared wallets
  - Group expense tracking
  - Bill splitting
  - Family account management

## 🛠 Technical Stack

### Frontend Architecture
```
React + TypeScript
├── Material-UI (UI Components)
├── Nivo Charts (Data Visualization)
├── Axios (API Client)
└── Context API (State Management)
```

### Backend Architecture
```
Node.js + Express
├── MongoDB (Database)
├── JWT (Authentication)
├── Express Validator (Input Validation)
└── Mongoose (ODM)
```

## ⚡ Prerequisites

1. **Required Software**
   - Node.js (v14 or higher)
   - MongoDB (v4.4 or higher)
   - npm or yarn

2. **Development Tools**
   - VS Code (recommended)
   - MongoDB Compass (optional)
   - Postman (API testing)

## 📥 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/pac-cee/wallet-app.git
cd wallet-app
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Required .env configurations
PORT=5002
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secure_secret
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Required .env configurations
REACT_APP_API_URL=http://localhost:5002/api
```

## 🚀 Development Setup

### Starting Development Servers

1. **Backend Server**
```bash
cd backend
npm run dev
```

2. **Frontend Development**
```bash
cd frontend
npm start
```

## 📁 Project Structure
```
wallet-app/
├── frontend/                 # React frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/     # API services
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── package.json
```

## 🌐 Deployment

The application is configured for deployment on Render:

1. **Backend Service**
   - Type: Web Service
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`

2. **Frontend Service**
   - Type: Static Site
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.
