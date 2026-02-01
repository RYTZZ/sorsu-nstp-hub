const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.get('/', settingController.getAllSettings);
router.get('/check-submissions', settingController.checkSubmissionStatus);
router.get('/:key', settingController.getSetting);
router.put('/:key', authMiddleware, requireRole('super_admin'), settingController.updateSetting);
router.post('/toggle-deadline', authMiddleware, requireRole('super_admin', 'campus_admin'), settingController.toggleDeadline);

module.exports = router;
