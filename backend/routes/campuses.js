const express = require('express');
const router = express.Router();
const campusController = require('../controllers/campusController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Campus routes
router.get('/', campusController.getAllCampuses);
router.get('/:id', campusController.getCampusById);
router.post('/', authMiddleware, requireRole('super_admin'), campusController.createCampus);
router.put('/:id', authMiddleware, requireRole('super_admin'), campusController.updateCampus);
router.delete('/:id', authMiddleware, requireRole('super_admin'), campusController.deleteCampus);

// Program routes
router.get('/:campusId/programs', campusController.getProgramsByCampus);
router.post('/programs', authMiddleware, requireRole('super_admin'), campusController.createProgram);
router.put('/programs/:id', authMiddleware, requireRole('super_admin'), campusController.updateProgram);
router.delete('/programs/:id', authMiddleware, requireRole('super_admin'), campusController.deleteProgram);

module.exports = router;
