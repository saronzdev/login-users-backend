const userSchema = require('../../models/user.js')
const fs = require('node:fs/promises')

function createUser(req, res) {
	const user = userSchema(req.body)
	user.save()
		.then(() => res.status(201).json({message: 'Created Successfully'}))
		.catch((err) => {
			res.status(500).json({
				message: 'API error creating user',
				error: err
			})
		})
}

function getUsersById(req, res) {
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
		.catch((err) => res.status(500).json({message: 'API error retrieving the user', err: err}))
}

function login(req, res) {
	let user = {}
	let found = false
	const {userOrEmail, password} = req.body
	userSchema.find().then((data) => {
		data.forEach((element) => {
			if ((element.user === userOrEmail || element.email === userOrEmail) && element.password === password) {
				const idLogin = element._id.toString()
				user = {
					id: idLogin
				}
				found = true
				return
			} else {
				found = false
				return
			}
		}).catch((err) => {
			res.status(500).json({
				message: 'API error in login',
				error: err
			})
		})
		if (found) {
			fs.writeFile('cookies.cook', JSON.stringify(user))
				.then(() => res.json({message: 'Login Successfully'}))
				.catch((err) => {
					res.status(500).json({err})
				})
		} else {
			res.status(404).json({message: 'User Not Found'})
		}
	})
}

function getUsers(req, res) {
	userSchema
		.find()
		.then((data) => {
			data ? res.json(data) : res.json({message: 'Not Found'})
		})
		.catch((err) => {
			res.status(500).json({
				message: 'API error in login',
				error: err
			})
		})
}

function updateUser(req, res) {
	const {id} = req.params
	const {user, password, email, age} = req.body
	userSchema
		.updateOne(
			{_id: id},
			{
				$set: {
					user,
					email,
					password,
					//money
					age
				}
			}
		)
		.then(() => {
			res.status(204).end()
		})
		.catch((err) => {
			res.status(404).json({message: 'User Not Found', err: err})
		})
}

function deleteUser(req, res) {
	const {id} = req.params
	userSchema
		.deleteOne({_id: id})
		.then(() => res.status(200).json({message: 'Deleted Successfully'}))
		.catch((err) => res.status(404).json({message: 'User Not Found', err: err}))
}

module.exports = {createUser, login, getUsers, getUsersById, updateUser, deleteUser}
