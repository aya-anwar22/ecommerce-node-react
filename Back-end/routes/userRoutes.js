const express = require('express');
const userControllers  = require('../controllers/userControllers');
const authenticate = require('../middleware/authenticate');
const upload = require('../config/multerConfig'); 
const router = express.Router();

router.post('/', authenticate, userControllers.addUser);
router.get('/me', authenticate, userControllers.getUserByToken)
router.get('/:userId', authenticate, userControllers.getUserByAdmin)
router.get('/', authenticate, userControllers.getAllUser)
router.put('/:userId?', authenticate, upload.single('file'), userControllers.updateUser)
router.delete('/:userId?', authenticate, userControllers.deleteUser)

module.exports = router;