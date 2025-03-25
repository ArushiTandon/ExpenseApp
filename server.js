const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/db');
const passport = require('./middlewares/auth');
// const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// routes
const purchaseRoutes = require('./routes/purchaseRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const reportRoutes = require('./routes/reportRoutes');

// models
const Order = require('./models/order');
const User = require('./models/User');
const expense = require('./models/expense');
const Password = require('./models/password');

const app = express();
const PORT = process.env.PORT;

app.use(passport.initialize());

var corOptions = {
    origin: '*'
}

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cors(corOptions));
app.use(bodyParser.json());

app.use('/expenseForm', express.static(path.join(__dirname, 'views', 'expenseForm')));
app.use(express.static(__dirname));

// Routes
app.get('/addExpense', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'expenseForm', 'index.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.use('/Cashfreeservices', express.static(path.join(__dirname, 'Cashfreeservices')));
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/password', passwordRoutes);
app.use('/report', reportRoutes);


User.hasMany(expense, { foreignKey: 'userId' });
expense.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Password, { foreignKey: 'userId' });
Password.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync({ alter: false })
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error('Failed to sync database:', err));
