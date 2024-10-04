const express = require('express');
const router = express.Router();
const bidsController = require('../controllers/bidsController');
const profitController = require('../controllers/profitController');

router.get("/", bidsController.getAllBid)
router.post('/newbid', bidsController.addBid);
router.get('/ongoing-bids', bidsController.getOngoingBids);
router.get('/archived-bids', bidsController.getArchivedBids);
// router.get("/profit",  bidsController.getProfit)
// router.get('/:bidId/profit', bidsController.getBidProfit)
router.get('/:bidId/profit', profitController.getProfitData);
router.get('/:id', bidsController.getBidById);
router.post('/:id/add-user', bidsController.addUserToBid);
router.put('/:id', bidsController.updateBid);
router.put('/:bidId/update-bid/:bidNo', bidsController.updateBidDetails);
router.put('/:bidId/update-users', bidsController.updateUsersInBid);
router.put('/:bidId/users/:userId', bidsController.updateUserInBid);
router.put('/:bidId/close-bid/:bidNo', bidsController.closeBid);
router.put('/:bidId/users/:userId/payment', bidsController.updatePaymentStatus);
router.get('/:id/payment-status',bidsController.paymentStatus );
router.get("/:id/archive-summary", bidsController.archiveSummary);
// router.put('/:bidId/users/:useerName/payment', bidsController.updatePaymentStatusinDue);
router.put('/:bidId/payment-status/:userId', bidsController.updatePaymentStatusAndRemoveDue);
router.delete('/:id/participants', bidsController.removeParticipants);
// router.post('/mark-paid', bidsController.markUserAsPaid);

module.exports = router;
