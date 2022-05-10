const express = require('express')
const routers = express.Router()

const movies = require('../modules/movies')
const users = require('../modules/users')
const auth = require('../modules/auth')

routers.use('/movies', movies.movieRoutes)
routers.use('/users', users.userRoutes)
routers.use('/auth', auth.authRoutes)

module.exports = routers