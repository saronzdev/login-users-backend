const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
const router = require('./routes/users')

const PORT = process.env.PORT || 8000

dotenv.config()
const app = express()

//random

app.use(express.json())

app.use(morgan('dev'))

app.use((req, res, next) => {
	mongoose
		.connect(process.env.MONGODB_URI)
		.then(() => {
			console.log('Connected') //developer feature
			next()
		})
		.catch((err) => {
			console.log('Error: ', err)
			res.end('Database Error' + err) //developer feature
		})
})

app.get('/', (req, res) => {
	res.send('Welcome')
})

app.use('/api', router)

app.listen(PORT, () => {
	console.log(`Server on http://localhost:${PORT}`)
})
