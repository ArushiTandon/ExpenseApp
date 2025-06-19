const express = require('express');
const path = require('path');
const connectDB = require('./util/db');
const passport = require('./middlewares/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/expenseForm', express.static(path.join(__dirname, 'views', 'expenseForm')));
app.use(express.static(__dirname));

app.get('/addExpense', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'expenseForm', 'index.html'));
});

app.get('/viewreport', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'PremiumFeatures', 'viewExpense', 'viewExpense.html'));
});

app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/Cashfreeservices', express.static(path.join(__dirname, 'Cashfreeservices')));
app.use('/user', require('./routes/userRoutes'));
app.use('/expense', require('./routes/expenseRoutes'));
app.use('/purchase', require('./routes/purchaseRoutes'));
app.use('/password', require('./routes/passwordRoutes'));
app.use('/report', require('./routes/reportRoutes'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
