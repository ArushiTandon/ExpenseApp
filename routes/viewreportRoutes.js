const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../middlewares/jwt')
const { viewReport } = require('../controllers/viewreportController');

router.get('/:reportType', jwtAuthMiddleware, viewReport);

module.exports = router;
