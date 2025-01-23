const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/db');

// routes
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// use routes
app.use('/user', userRoutes);


sequelize.sync({ force: false }) 
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error('Failed to sync database:', err));
