const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/db');
const passport = require('./auth');
require('dotenv').config();

// routes
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const Order = require('./models/order');
const User = require('./models/User');
const expense = require('./models/expense');

const app = express();
const PORT = 3000;

app.use(passport.initialize());

// middlewares
app.use(cors());
app.use(bodyParser.json());

app.use('/expenseForm', express.static(path.join(__dirname, 'expenseForm')));
app.use(express.static(__dirname));

// Routes
app.get('/addExpense', (req, res) => {
    res.sendFile(path.join(__dirname, 'expenseForm', 'index.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'user.html')); 
});

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);

User.hasMany(expense)
expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


sequelize.sync({ force: true })
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error('Failed to sync database:', err));
