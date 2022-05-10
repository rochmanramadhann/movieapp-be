const movieModel = require('./movieModel')
const { baseResponse } = require('../../helpers')
const { faker } = require('@faker-js/faker')


module.exports = {
    getMovies: async (req, res) => {
        if (req.user.role === 1 || req.user.role === 2) {
            try {
                const requestData = {
                    search: req.query.search,
                    order_by: req.query.order_by,
                    order: req.query.order,
                    page: req.query.page || 1,
                    limit: req.query.limit || 5,
                }

                const { data, meta } = await movieModel.getMovies(requestData)

                if (data.length <= 0) {
                    return baseResponse(res, 404, 'Data not found')
                }
                return baseResponse(res, 200, data, meta)
            } catch (error) {
                return baseResponse(res, 500, `Bad request (${error.message})`)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
    getMovieById: async (req, res) => {
        if (req.user.role === 1 || req.user.role === 2) {
            try {
                const data = await movieModel.getMovieById(req.params.id)

                if (data.length <= 0) {
                    return baseResponse(res, 404, 'Data not found')
                }
                data[0].thumbnail = 'http://localhost:9000/' + data[0].thumbnail
                return baseResponse(res, 200, data)
            } catch (error) {
                return baseResponse(res, 500, `Bad request (${error.message})`)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
    addMovie: async (req, res) => {
        if (req.user.role === 1) {
            try {
                let thumbnail = ''

                if (req.file !== undefined) {
                    thumbnail = 'http://localhost:9000/' + req.file.path
                }

                const { title, director, duration_hour, duration_minute, release_date, synopsis } = req.body
                const data = await movieModel.addMovie({ title, thumbnail, director, duration_hour, duration_minute, release_date, synopsis })
                baseResponse(res, 200, data)
            } catch (error) {
                baseResponse(res, 500, error)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
    updateMovie: async (req, res) => {
        if (req.user.role === 1) {
            try {
                let thumbnail = ''

                if (req.file !== undefined) {
                    thumbnail = 'http://localhost:9000/' + req.file.path
                }

                const requestData = {
                    id: req.params.id,
                    title: req.body.title,
                    thumbnail: thumbnail,
                    director: req.body.director,
                    duration_hour: req.body.duration_hour,
                    duration_minute: req.body.duration_minute,
                    release_date: req.body.release_date,
                    synopsis: req.body.synopsis
                }

                const movieData = await movieModel.getMovieById(req.params.id)
                if (movieData.length <= 0) {
                    return baseResponse(res, 404, 'Data not found')
                }

                const data = await movieModel.updateMovie(requestData)
                baseResponse(res, 200, data)
            } catch (error) {
                baseResponse(res, 500, error)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
    softDeleteMovie: async (req, res) => {
        if (req.user.role === 1) {
            try {
                const movieData = await movieModel.getMovieById(req.params.id)
                if (movieData.length <= 0) {
                    return baseResponse(res, 404, 'Data not found')
                }

                const data = await movieModel.softDeleteMovie(req.params.id)
                baseResponse(res, 200, data)
            } catch (error) {
                baseResponse(res, 500, error)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
    deleteMovie: async (req, res) => {
        if (req.user.role === 1) {
            try {
                const movieData = await movieModel.getMovieById(req.params.id)
                if (movieData.length <= 0) {
                    return baseResponse(res, 404, 'Data not found')
                }

                const data = await movieModel.deleteMovie(req.params.id)
                baseResponse(res, 200, data)
            } catch (error) {
                baseResponse(res, 500, error)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
}

// const date = faker.date.between('2020-01-01', '2020-12-31')
// const movieName = ['The Batman', 'The Northman', '365 Days: This Day', 'Uncharted', 'Everything Everywhere All at Once', 'Doctor Strange in the Multiverse of Madness', 'Thor: Love and Thunder', 'The Unbearable Weight of Massive Talent', '365 Days', 'X', 'The Black Phone', 'Fantastic Beasts: The Secrets of Dumbledore', 'Ambulance', 'Death on the Nile', 'K.G.F: Chapter 2', 'Spider-Man: No Way Home', 'Spider-Man', 'Spider-Man: Homecoming', 'Spider-Man: Into the Spider-Verse', 'Spider-Man: Far from Home', 'The Amazing Spider-Man', 'Spider-Man 3', 'The Amazing Spider-Man 2']
// for (let index = 0; index < movieName.length; index++) {
//     const data = await movieModel.addMovie({ title: movieName[index], thumbnail: faker.image.business(), director: faker.name.firstName(), duration_hour: 1, duration_minute: Math.floor(Math.random() * 90 + 10), release_date: date, synopsis: faker.lorem.paragraph(10) })
//     console.log(res, 200, data)
// }
