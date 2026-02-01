const express = require('express');
const router = express.Router();
const multer = require('multer');
const concernController = require('../controllers/concernController');
const { authMiddleware, requireRole } = require('../middleware/auth');

const upload = multer({ dest: '/tmp/uploads/' });

router.post('/', upload.single('attachment'), concernController.createConcern);
router.get('/reference/:referenceNumber', concernController.getConcernByReference);
router.get('/', authMiddleware, requireRole('super_admin', 'campus_admin'), concernController.getAllConcerns);
router.put('/:id', authMiddleware, requireRole('super_admin', 'campus_admin'), concernController.updateConcern);
router.delete('/:id', authMiddleware, requireRole('super_admin'), concernController.deleteConcern);

module.exports = router;
