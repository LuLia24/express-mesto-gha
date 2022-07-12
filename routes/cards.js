const router = require('express').Router();
const {
  getAllCards, deletCardById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.delete('/:cardId', deletCardById);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

// mesto.ru/users/12345/

// req.params.userId = '12345';
module.exports = router;
