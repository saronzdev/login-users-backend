const express = require('express')
const userSchema = require('../models/user.js')

const router = express.Router()

//Get all users
router.get('/users', (req, res) => {
    userSchema
        .find()
        .then((data) => res.json(data))
        .catch((err) => {
            res.status(500).json({
                message: 'API error retrieving users',
                error: err,
            })
        })
})

//Get one users by ID
router.get('/users/:id', (req, res) => {
    const {id} = req.params
    userSchema
        .findById(id)
        .then((data) => {
            if (data) {
                res.json(data)
            } else {
                res.status(404).json({message: 'User not found'})
            }
        })
        .catch((err) =>
            res
                .status(500)
                .json({message: 'API error retrieving the user', err: err}),
        )
})

//Create a new user
router.post('/users', (req, res) => {
    const user = userSchema(req.body)
    user.save()
        .then(() => res.status(201).json({message: 'Created Successfully'}))
        .catch((err) => {
            res.status(500).json({
                message: 'API error creating user',
                error: err,
            })
        })
})

//Udapte a complete user
router.put('/users/:id', (req, res) => {
    const {id} = req.params
    const {user, email, password} = req.body
    userSchema
        .updateOne(
            {_id: id},
            {
                $set: {
                    user,
                    email,
                    password,
                },
            },
        )
        .then(() => res.status(204).end())
        .catch((err) => {
            res.status(404).json({message: 'User Not Found', err: err})
        })
})

//Delete a user
router.delete('/users/:id', (req, res) => {
    const {id} = req.params
    userSchema
        .deleteOne({_id: id})
        .then(() => res.status(200).json({message: 'Deleted Successfully'}))
        .catch((err) =>
            res.status(404).json({message: 'User Not Found', err: err}),
        )
})

module.exports = router
