const express = require('express')
const userSchema = require('../models/user.js')

let login = false
let idLogin = ''

const router = express.Router()

router.post('/users', (req, res) => {
  const user = userSchema(req.body)
  user
    .save()
    .then(() => res.status(201).json({message: 'Created Successfully'}))
    .catch((err) => {
      res.status(500).json({
        message: 'API error creating user',
        error: err,
      })
    })
})

router.get('/users/login', (req, res) => {
  login = false
  const {userOrEmail, password} = req.body
  userSchema
    .find()
    .then((data) => {
      data.forEach((element) => {
        if (
          (element.user === userOrEmail || element.email === userOrEmail) &&
          element.password === password
        ) {
          login = true
          idLogin = element._id
          return
        }
      })
      login
        ? res.json({message: 'Loggin Successfully'})
        : res.json({message: 'Invalid Credentials'})
    })
    .catch((err) => {
      res.status(500).json({
        message: 'API error in login',
        error: err,
      })
    })
})

router.use((req, res, next) => {
  if (login) {
    next()
  } else {
    res.json({message: 'Login Required'})
  }
})

router.get('/users/:id', (req, res) => {
  const {id} = req.params
  if (id === idLogin) {
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
  } else {
    res.json({message: 'Unauthorized'})
  }
})

router.put('/users/:id', (req, res) => {
  const {id} = req.params
  const {user, password, email, age} = req.body
  if (id === idLogin) {
    userSchema
      .updateOne(
        {_id: id},
        {
          $set: {
            user,
            email,
            password,
            //money
            age,
          },
        },
      )
      .then(() => {
        res.status(204).end()
      })
      .catch((err) => {
        res.status(404).json({message: 'User Not Found', err: err})
      })
  } else {
    res.json({message: 'Unauthorized'})
  }
})

//Delete a user
router.delete('/users/:id', (req, res) => {
  const {id} = req.params
  if (id === idLogin) {
    userSchema
      .deleteOne({_id: id})
      .then(() => res.status(200).json({message: 'Deleted Successfully'}))
      .catch((err) =>
        res.status(404).json({message: 'User Not Found', err: err}),
      )
  } else {
    res.json({message: 'Unauthorized'})
  }
})

router.use((req, res, next) => {
  const {user, password} = req.query
  userSchema
    .findById('666be70d8cb4459bd3fc117e')
    .then((data) => {
      if (data) {
        if (user === data.user && password === data.password) {
          next()
        } else {
          res.json({
            message: 'Your`e not a Super User',
          })
        }
      }
    })
    .catch((err) =>
      res.json({message: 'Error with super user auth', error: err}),
    )
})

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

module.exports = router
