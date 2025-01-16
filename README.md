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

---
For detailed documentation, visit our [Wiki](https://github.com/pac-cee/Taskforce_2.0/wiki)
