const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');

// Definición de endpoints
router.get('/', projectController.getAll);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);
router.get('/statuses', projectController.getStatuses);

module.exports = router;