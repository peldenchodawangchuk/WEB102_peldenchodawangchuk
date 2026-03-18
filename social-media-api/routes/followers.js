const express = require('express');
const {
    getFollowers,
    getFollower,
    createFollower,
    updateFollower,
    deleteFollower,
} = require('../controllers/followers');

const router = express.Router();

router.route('/').get(getFollowers).post(createFollower);

router.route('/:id').get(getFollower).put(updateFollower).delete(deleteFollower);

module.exports = router;