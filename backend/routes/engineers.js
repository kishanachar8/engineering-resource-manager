const express = require('express');
const router = express.Router();
const engineerController = require('../controllers/engineerController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Define all routes using functions
router.get('/', engineerController.getEngineers);
router.get('/:id/capacity', engineerController.getCapacity);
router.get('/:id', authMiddleware, engineerController.getProfile);


module.exports = router;
