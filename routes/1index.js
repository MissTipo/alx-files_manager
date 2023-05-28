const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
// const UserController = require('../controllers/UserController')
//routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
//New User iplemention
// router.post('/users', UserController.postNew);

module.exports = router;
