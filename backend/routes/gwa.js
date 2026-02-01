const express = require('express');
const router = express.Router();
const multer = require('multer');
const gwaController = require('../controllers/gwaController');
const { authMiddleware, requireRole } = require('../middleware/auth');

const upload = multer({ dest: '/tmp/uploads/' });

router.post('/calculate', gwaController.calculateGWA);
router.post('/submit', upload.single('proof'), gwaController.submitGWA);
router.get('/reference/:referenceNumber', gwaController.getGWAByReference);
router.get('/', authMiddleware, requireRole('super_admin', 'campus_admin'), gwaController.getAllGWASubmissions);
router.put('/:id', authMiddleware, requireRole('super_admin', 'campus_admin'), gwaController.updateGWASubmission);

module.exports = router;
