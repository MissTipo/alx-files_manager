const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController').default;
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

//routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect)
router.get('/disconnect', AuthController.getdisconnect)
router.get('/users/me', UsersController.getMe)
router.post('/files', FilesController.postUpload)
router.get('/files/:id', FilesController.getShow)
router.get('/files', FilesController.getIndex)
module.exports = router;
