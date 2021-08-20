const { Thought, User } = require('../models');

const thoughtController = {
    
    // get all thoughts
    getAllThought(req,res) {
        Thought.find({})
        .populate({
            path: 'reaction',
            select: '-_v'
        })
        .select('-_v')
        .sort({_id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    // get specific thoughts
    getThoughtById({params }, res) {
        Thought.findOne({_id: params.id })
        .populate({
            path: 'reaction',
            select: '-_v'
        })
        .select('-_v')
        .sort({_id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    // create Thought
    createThought({body}, res) {
        Thought.create({
            thoughtText: body.thoughtText,
            username: body.username
        })
        .then(({ _id }) => {
            return User.findByIdAndUpdate(
                {_id: body.userId},
                {$push: {thoughts: _id} },
                {new: true, runValidators: true}
        )
        })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(400).json(err));
    },

    // update Thought by id
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({_id: params.id }, body, {new: true, runValidators:true})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No Thought found!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(400).json(err));
    },

    // delete Thought by id
    deleteThought({ params } , res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No Thought found!'})
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // create a reaction
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: {reaction: body}},
            {new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No Thought found!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    // delete a reaction
    deleteReaction({params, body} , res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            { $pull: { reaction: { reactionId: body.reactionId } } },
            {new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            
            if (!dbThoughtData) {
                res.status(404).json({message: 'No reaction found!' });
                return;
            }
            res.json({ message: 'Succesfully deleted this reaction!'});
        })    
        .catch(err => res.json(err));
    }
}

module.exports = thoughtController;