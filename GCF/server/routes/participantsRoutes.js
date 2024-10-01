const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Adjust the path as necessary
const participantsController = require('../controllers/participantsController');

router.get('/', participantsController.searchParticipants);
router.get('/all', participantsController.getAllParticipants);
router.post('/new', upload.single('profileImage'), participantsController.addParticipant);
router.get('/:id',participantsController.getOneCompleteParticipant )
router.get("/:id/bids", participantsController.getParticipantDetailsWithBids)


module.exports = router;
