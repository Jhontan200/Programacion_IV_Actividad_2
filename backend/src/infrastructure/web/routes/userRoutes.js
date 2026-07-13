const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/', userController.getAll);
router.post('/', userController.create);
router.put('/:id', userController.update); // Habilitado PUT
router.delete('/:id', userController.delete);
router.post('/login', userController.login); // Habilitado LOGIN

module.exports = router;