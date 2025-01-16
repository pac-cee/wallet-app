# 💰 TASKforce Wallet App

A comprehensive, full-stack personal finance management application with powerful features for tracking expenses, managing multiple wallets, and visualizing your financial journey.

## 📚 Table of Contents
- [Features](#-features)
- [Technical Stack](#-technical-stack)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Git LFS Setup](#-git-lfs-setup)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [Task Force Pro Edition](#-task-force-pro-edition---wallet-web-application)

## 🌟 Features

### Core Features
- 💳 **Multi-Wallet Management**
  - Create unlimited wallets
  - Support for multiple currencies
  - Real-time balance tracking
  - Inter-wallet transfers

- 📊 **Advanced Transaction Tracking**
  - Income and expense logging
  - Recurring transactions
  - Bulk transaction import/export
  - Receipt image attachments

- 🎯 **Budgeting Tools**
  - Monthly budget setting
  - Category-wise budget limits
  - Budget vs. actual analysis
  - Overspending alerts

- 📈 **Analytics Dashboard**
  - Expense patterns visualization
  - Income trends analysis
  - Category-wise breakdown
  - Custom date range reports

### Additional Features
- 🌙 Dark/Light theme support
- 📱 Responsive design for all devices
- 🔔 Push notifications
- 📤 Data export functionality
- 🔒 Enhanced security features

## 🛠 Technical Stack

### Frontend Architecture
```
React + TypeScript
├── Material-UI (UI Components)
├── Framer Motion (Animations)
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
   - Git with LFS support
   - MongoDB (v4.4 or higher)
   - npm or yarn

2. **Development Tools**
   - VS Code (recommended)
   - MongoDB Compass (optional)
   - Postman (API testing)

## 📥 Installation Guide

### 1. Git LFS Setup (Important!)
```bash
# Install Git LFS
git lfs install

# Clone with LFS support
git clone https://github.com/pac-cee/Taskforce_2.0.git
cd Taskforce_2.0

# Pull LFS objects
git lfs pull
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
MONGODB_URI=mongodb://localhost:27017/wallet-app
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
REACT_APP_ENV=development
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

### Available Scripts
- `npm run dev`: Development mode
- `npm run build`: Production build
- `npm run test`: Run tests
- `npm run lint`: Code linting

## 📁 Project Structure
```
wallet-app/
├── frontend/                 # React frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/            # Helper functions
│   └── package.json
│
├── .gitattributes          # Git LFS configuration
├── .gitignore             # Git ignore rules
└── README.md
```

## 🔧 Git LFS Configuration

### Tracked Files
```gitattributes
# Large Files
**/node_modules/** filter=lfs diff=lfs merge=lfs -text
**/.cache/** filter=lfs diff=lfs merge=lfs -text
*.pack filter=lfs diff=lfs merge=lfs -text

# Media Files
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
```

### Ignored Patterns
```gitignore
# Development
.cache/
node_modules/.cache/
**/default-development/
*.pack
```

## 🚀 Deployment

### Production Build
1. Frontend:
```bash
cd frontend
npm run build
```

2. Backend:
```bash
cd backend
npm run build
```

### Deployment Checklist
- [ ] Update environment variables
- [ ] Build production assets
- [ ] Configure MongoDB connection
- [ ] Set up SSL certificates
- [ ] Configure CORS settings
- [ ] Set up process manager (PM2)

### Environment Variables

#### Backend (.env.production)
```
NODE_ENV=production
PORT=5002
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://wallet-app-frontend.onrender.com
```

#### Frontend (.env.production)
```
REACT_APP_API_URL=https://wallet-app-backend.onrender.com/api
```

### Deployment Steps

1. Push your code to GitHub
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Render will automatically deploy both frontend and backend using the configuration in render.yaml

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Install Git LFS
4. Make your changes
5. Run tests
6. Submit PR

## ❗ Troubleshooting

### Common Issues

1. **Git LFS Issues**
```bash
# Verify LFS installation
git lfs install

# Reset LFS
git lfs uninstall
git lfs install
```

2. **Node Modules Issues**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

3. **MongoDB Connection**
- Check MongoDB service is running
- Verify connection string
- Check network access

### Support Channels
- GitHub Issues
- Documentation Wiki
- Community Discord

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Material-UI team
- MongoDB team
- Open source community
- All contributors

## 🚀 Task Force Pro Edition - Wallet Web Application

### Use Case
Eric, an employee of Code of Africa GmbH, needs a web application to manage his various financial accounts (bank accounts, mobile money, cash, etc.) and track his expenses efficiently.

### 🎯 Core Functionalities

1. **Multi-Account Transaction Tracking**
   - Track all income and expenses across different accounts
   - Support for bank accounts, mobile money, and cash
   - Real-time balance updates
   - Transaction history with search and filter options

2. **Custom Report Generation**
   - Generate detailed financial reports for any time period
   - Export reports in multiple formats
   - Visual representation of income vs expenses
   - Category-wise spending analysis

3. **Smart Budget Management**
   - Set monthly/yearly budgets for different categories
   - Real-time budget tracking
   - Instant notifications when budget limits are exceeded
   - Budget vs actual spending comparison

4. **Category Management**
   - Create and manage expense categories
   - Add subcategories for detailed expense tracking
   - Color coding for easy visualization
   - Category-wise spending insights

5. **Expense Categorization**
   - Link each transaction to specific categories/subcategories
   - Automatic category suggestions based on transaction patterns
   - Bulk categorization for multiple transactions
   - Edit category assignments

6. **Visual Analytics**
   - Interactive dashboards with spending patterns
   - Category-wise pie charts and bar graphs
   - Time-series analysis of expenses
   - Budget utilization visualization

### 🌐 Live Demo
The application is deployed and accessible at: [https://taskforce-wallet.onrender.com](https://taskforce-wallet.onrender.com)

---
For detailed documentation, visit our [Wiki](https://github.com/pac-cee/Taskforce_2.0/wiki)
