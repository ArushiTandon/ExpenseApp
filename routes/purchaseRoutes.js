const purchaseController = require('../controllers/purchaseController')

const { jwtAuthMiddleware } = require("../util/jwt");

// const auth =
const router = express.Router();

router.get('/premiummembership', jwtAuthMiddleware, purchaseController.purchasePremium);
router.post('/transactionstatus', jwtAuthMiddleware, purchaseController.purchaseStatus);

module.exports = router;