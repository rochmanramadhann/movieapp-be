const userModel = require('./userModel')
const { baseResponse, hashPassword } = require('../../helpers')
const { faker } = require('@faker-js/faker')


module.exports = {
    getUsers: async (req, res) => {
        if (req.user.role === 1) {
            try {
                const requestData = {
                    search: req.query.search,
                    orderBy: req.query.orderBy,
                    order: req.query.order,
                    page: req.query.page || 1,
                    limit: req.query.limit || 5,
                }

                const { data, meta } = await userModel.getUsers(requestData)

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
    getUserById: async (req, res) => {
        if (req.user.role === 1) {
            try {
                const data = await userModel.getUserById(req.params.id)

                if (data.length <= 0) {
                    return baseResponse(res, 404, 'Data not found')
                }
                // console.log('localhost:9000/' + data[0].avatar)
                data[0].avatar = 'http://localhost:9000/' + data[0].avatar
                return baseResponse(res, 200, data)
            } catch (error) {
                return baseResponse(res, 500, `Bad request (${error.message})`)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
    getUserByEmail: async (req, res) => {
        if (req.user.role === 1) {
            try {
                const data = await userModel.getUserByEmail(req.body.email)

                if (data.length <= 0) {
                    return baseResponse(res, 404, 'Data not found')
                }
                data[0].avatar = 'http://localhost:9000/' + data[0].avatar
                return baseResponse(res, 200, data)
            } catch (error) {
                return baseResponse(res, 500, `Bad request (${error.message})`)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
    addUser: async (req, res) => {
        if (req.user.role === 1) {
            try {
                let avatar = ''

                if (req.file !== undefined) {
                    avatar = 'http://localhost:9000/' + req.file.path
                }

                const { role_id, firstName, lastName, phoneNumber, email, password } = req.body
                const passwordEncrypted = await hashPassword(password)

                const data = await userModel.addUser({ role_id, firstName, lastName, phoneNumber, email, password: passwordEncrypted, avatar })
                baseResponse(res, 200, data)
            } catch (error) {
                baseResponse(res, 500, error)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
    updateUser: async (req, res) => {
        if (req.user.role === 1) {
            try {
                let avatar = ''

                if (req.file !== undefined) {
                    avatar = 'http://localhost:9000/' + req.file.path
                }

                const userData = await userModel.getUserById(req.params.id)
                if (userData.length <= 0) {
                    return baseResponse(res, 404, 'Data not found')
                }


                const passwordEncrypted = await hashPassword(req.body.password)

                const requestData = {
                    id: req.params.id,
                    role_id: req.body.role_id,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    phone_number: req.body.phone_number,
                    email: req.body.email,
                    password: passwordEncrypted,
                    director: req.body.director,
                    avatar: avatar
                }

                const data = await userModel.updateUser(requestData)

                baseResponse(res, 200, data)
            } catch (error) {
                baseResponse(res, 500, error)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
    softDeleteUser: async (req, res) => {
        if (req.user.role === 1) {
            try {
                const userData = await userModel.getUserById(req.params.id)
                if (userData.length <= 0) {
                    return baseResponse(res, 404, 'Data not found')
                }

                const data = await userModel.softDeleteUser(req.params.id)
                baseResponse(res, 200, data)
            } catch (error) {
                baseResponse(res, 500, error)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
    deleteUser: async (req, res) => {
        if (req.user.role === 1) {
            try {
                const userData = await userModel.getUserById(req.params.id)
                if (userData.length <= 0) {
                    return baseResponse(res, 404, 'Data not found')
                }

                const data = await userModel.deleteUser(req.params.id)
                baseResponse(res, 200, data)
            } catch (error) {
                baseResponse(res, 500, error)
            }
        } else {
            return baseResponse(res, 403, 'you don\'t have authorization to access this api')
        }
    },
}

// const passwordEncrypted = await hashPassword('password')
// for (let index = 0; index < 10; index++) {
//     const data = await userModel.addUser({ role_id: 1, firstName: faker.name.firstName('male'), lastName: faker.name.lastName('male'), phoneNumber: faker.phone.phoneNumber('+62 813 #### ####'), email: faker.internet.email(), password: passwordEncrypted, avatar: '' })
//     console.log(res, 200, data)
// }