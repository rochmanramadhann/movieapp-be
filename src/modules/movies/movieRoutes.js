const express = require('express')
const movieController = require('./movieController')
const middleware = require('../../middleware')

const routers = express.Router()

routers.get('/', middleware.validate, movieController.getMovies)
routers.get('/:id', middleware.validate, movieController.getMovieById)
routers.post('/', middleware.validate, middleware.upload.single('thumbnail'), movieController.addMovie)
routers.put('/:id', middleware.validate, middleware.upload.single('thumbnail'), movieController.updateMovie)
routers.put('/soft/:id', middleware.validate, movieController.softDeleteMovie)
routers.delete('/:id', middleware.validate, movieController.deleteMovie)

module.exports = routers
