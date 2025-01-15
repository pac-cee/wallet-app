# TASKforce Wallet App

A modern, full-stack personal finance management application built with React, TypeScript, Node.js, and MongoDB.

## Features

- 💰 **Multi-wallet Management**: Create and manage multiple wallets with different currencies
- 📊 **Transaction Tracking**: Record and categorize income and expenses
- 🏷️ **Custom Categories**: Create and manage custom categories for better organization
- 📈 **Dashboard Analytics**: Visual representation of your financial data
- 🔐 **Secure Authentication**: JWT-based authentication system
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for UI components
- Context API for state management
- Axios for API calls
- Framer Motion for animations
- Nivo for charts and visualizations

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Express Validator for input validation

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/pac-cee/Task-Force-2.0.git
cd Task-Force-2.0
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory:
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/wallet-app
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

5. Create a .env file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5002/api
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Testing the Application

1. **Create a New Account**:
   - Visit http://localhost:3000/register
   - Fill in your details (name, email, password)
   - Click "Register"

2. **Login**:
   - Visit http://localhost:3000/login
   - Enter your email and password
   - Click "Login"

3. **Create a Wallet**:
   - Click "Add Wallet" on the dashboard
   - Enter wallet name and initial balance
   - Select currency
   - Click "Create"

4. **Add Categories**:
   - Go to Categories page
   - Click "Add Category"
   - Enter category name
   - Select type (Income/Expense)
   - Choose color
   - Click "Create"

5. **Record Transactions**:
   - Click "Add Transaction" on the dashboard
   - Select transaction type
   - Choose category and wallet
   - Enter amount and description
   - Click "Add"

6. **View Reports**:
   - Navigate to the Dashboard
   - View spending patterns
   - Check budget progress
   - Analyze income vs expenses

## Features in Detail

### Wallet Management
- Create multiple wallets
- Track balance for each wallet
- Support for different currencies
- Transfer between wallets

### Transaction Management
- Record income and expenses
- Categorize transactions
- Add notes and dates
- Filter and search transactions
- Export transaction history

### Category Management
- Create custom categories
- Assign colors to categories
- Organize by income/expense
- Set budget limits per category

### Reports and Analytics
- Monthly summary
- Category-wise breakdown
- Income vs Expense trends
- Budget tracking
- Custom date range reports

### User Settings
- Profile management
- Password change
- Notification preferences
- Theme customization
- Currency preferences

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Input validation and sanitization
- CORS protection
- Rate limiting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Support

For support, email support@taskforce.com or join our Slack channel.

## Acknowledgments

- Material-UI for the awesome component library
- Nivo for the beautiful charts
- The MongoDB team for the amazing database
- The open-source community for their invaluable contributions
