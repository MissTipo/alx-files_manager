const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

//routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
//for task 3 fix this
// router.get('/connect', AuthController.getConnect)
// router.get('/disconnect', AuthController.getDisconnect)
// router.get('/user/me', UsersController.getMe)

module.exports = router;
