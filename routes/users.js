const router = require('express').Router();
const {
  createUser, getUserById, getAllUsers, setAvatar, setMe,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me/avatar', setAvatar);
router.patch('/me', setMe);

module.exports = router;
