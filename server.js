const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(bodyParser.json());

const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/user', userRoutes);

app.listen(3000, () => {
    console.log('Server started at port: 3000');
});