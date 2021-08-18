const { User } = require('../models');

const userController = {
    // get all users
    getAllUser(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-_v'
        })
        .populate({
            path: 'friends',
            select: '-_v'
        })
        .select('-_v')
        .sort({_id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    getUserById({ params } , res) {
        User.findOne({_id: params.id })
        .populate({
            path: 'thoughts',
            select: '-_v'
        })
        .populate({
            path: 'friends',
            select: '-_v'
        })
        .select('-_v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create a user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    // update user by id
    updateUser({ params, body}, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete user
    deleteUser({ params}, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found!' })
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // add a friend
    addFriend({params}, res) {
       User.findOneAndUpdate(
           {_id: params.userId},
           {$push: {friends: params.friendId}},
           {new: true, runValidators: true}
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this id!' })
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // delete a friend
    deleteFriend({ params} , res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            {$pull: {friends: params.friendId}},
            {new: true, runValidators: true}
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id!' })
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => res.json(err));
    },
};

module.exports = userController;