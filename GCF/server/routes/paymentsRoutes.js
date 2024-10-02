const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

router.get('/get-payment-due-users', paymentsController.getPayemntDueUsers)
router.post('/update-payment-due', paymentsController.updatePaymentDue);


module.exports = router;
