const router = require('express').Router();
const {} = require('../../controllers/user-controller');

router
.router('/')
.get()
.post();

router
.router('/:id')
.get()
.put()
.delete();

router
.router('/:userId/friends/:friendId')
.post()
.delete();

module.exports = router;