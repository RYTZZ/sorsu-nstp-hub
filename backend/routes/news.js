const express = require('express');
const router = express.Router();
const multer = require('multer');
const newsController = require('../controllers/newsController');
const { authMiddleware, requireRole } = require('../middleware/auth');

const upload = multer({ dest: '/tmp/uploads/' });

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', authMiddleware, requireRole('super_admin', 'campus_admin'), upload.single('image'), newsController.createNews);
router.put('/:id', authMiddleware, requireRole('super_admin', 'campus_admin'), upload.single('image'), newsController.updateNews);
router.delete('/:id', authMiddleware, requireRole('super_admin', 'campus_admin'), newsController.deleteNews);

module.exports = router;
