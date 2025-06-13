const express = require('express');
const fs = require('fs');
const path = require('path');
const connectDB = require('./util/db');
const passport = require('./middlewares/auth');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(passport.initialize());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/expenseForm', express.static(path.join(__dirname, 'views', 'expenseForm')));
app.use(express.static(__dirname));

app.get('/addExpense', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'expenseForm', 'index.html'));
});

app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.use('/Cashfreeservices', express.static(path.join(__dirname, 'Cashfreeservices')));
app.use('/user', require('./routes/userRoutes'));
app.use('/expense', require('./routes/expenseRoutes'));
app.use('/purchase', require('./routes/purchaseRoutes'));
app.use('/password', require('./routes/passwordRoutes'));
app.use('/report', require('./routes/reportRoutes'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
