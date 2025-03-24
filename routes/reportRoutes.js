const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../middlewares/jwt')
const { viewReport , downloadReport } = require('../controllers/reportController');

router.get('/view/:reportType', jwtAuthMiddleware, viewReport);

router.get('/downloadreport', jwtAuthMiddleware, downloadReport);

module.exports = router;
