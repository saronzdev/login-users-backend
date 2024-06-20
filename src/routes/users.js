const express = require('express')
const modul = require('./modules/users_modules.js')
const fs = require('node:fs/promises')

const router = express.Router()

router.post('/users', (req, res) => {
	modul.createUser(req, res)
})

router.get('/users/login', (req, res) => {
	modul.login(req, res)
})

router.use('/users/:id', (req, res, next) => {
	const {id} = req.params
	try {
		fs.readFile('cookies.cook', 'utf-8')
			.then((data) => {
				if (data) {
					const dataObject = JSON.parse(data)
					if (id === dataObject.id) {
						next()
						console.log('pase')
					} else {
						res.status(401).json({message: 'Unauthorized'})
					}
				} else {
					res.json({message: 'Login Needed'})
				}
			})
			.catch((err) => res.json({error: err}))
	} catch (err) {
		res.json({message: 'Login Needed', error: err})
	}
})

router.get('/users/:id', (req, res) => {
	modul.getUsersById(req, res)
})

router.put('/users/:id', (req, res) => {
	modul.updateUser(req, res)
})

//Delete a user
router.delete('/users/:id', (req, res) => {
	modul.deleteUser(req, res)
})

//Admin Actions
//router.use((req, res, next) => {
//su ? next() : res.status(401).json({message: 'Unauthorized'})
//})

router.get('/users', (req, res) => {
	modul.getUsers(req, res)
})

module.exports = router
