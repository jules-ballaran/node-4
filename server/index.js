const express = require('express')
const massive = require('massive')
const users = require('./controllers/users.js')
const jwt = require('jsonwebtoken')
const secret = require('../secret.js')

massive({
	host: 'localhost',
	port: 5432,
	database: 'node4db',
	user: 'postgres',
	password: 'node4db'
}).then(db => {
	const app = express()

	app.set('db', db)
	app.use(express.json())

	const auth = (req, res, next) => {
		if(!req.headers.authorization) {
			return res.status(401).end()
		}
		try {
			const token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, secret)
			next()
		} catch (err) {
			console.error(err)
			res.status(401).end()
		}
	}



	app.post('/api/register', users.create)
	app.post('/api/login', users.login)
	app.use(auth)
	app.get('/api/protected/data', users.protected)

	const PORT = 3001
	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`)
	})
})