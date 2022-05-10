const express = require('express')
const userController = require('./userController')
const middleware = require('../../middleware')

const routers = express.Router()

routers.get('/', middleware.validate, userController.getUsers)
routers.get('/:id', middleware.validate, userController.getUserById)
routers.post('/', middleware.validate, userController.getUserByEmail)
routers.post('/', middleware.validate, middleware.upload.single('avatar'), userController.addUser)
routers.put('/:id', middleware.validate, middleware.upload.single('avatar'), userController.updateUser)
routers.put('/soft/:id', middleware.validate, userController.softDeleteUser)
routers.delete('/:id', middleware.validate, userController.deleteUser)

module.exports = routers
