const router = require('express').Router();
const {} = require('../../controllers/thought-controller');

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
.router('/:thoughtId/reactions')
.post()
.delete();
