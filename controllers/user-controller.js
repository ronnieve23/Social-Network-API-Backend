const {User, Thought} = require('../models');

const userController = {
    //get all users
    getAllUsers (req, res){
        User.find({})
        .populate({
            path:'thoughts',
            select:'-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch (err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

     //get one user
     getUserById ({params}, res){
        User.findOne({_id: params.id })
        .populate({
            path:'thoughts',
            select:'-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch (err => {
            res.status(400).json(err);
        });
    },

    // add new user
    createUser({body},res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(400).json(err));
    },

    //update user
    updateUser ({params, body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new: true})
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch (err => {
            res.status(400).json(err);
        });
    },

    //delete user by id and their thoughts <<(BONUS)
    deleteUser(req, res) {
        User.findOneAndDelete({_id: req.params.id })
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({message: 'No user found with this id!'});
            }
            return Thought.deleteMany({_id:{$in: dbUserData.thoughts}});
        })
        .then(()=>{
            res.json({mesage: 'User and their thoughts have been deleted!'});
        })
        .catch (err => {
            res.status(400).json(err);
        });
    }

};

module.exports = userController;