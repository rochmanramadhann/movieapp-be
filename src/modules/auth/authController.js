const userModel = require('../users/userModel')
const { baseResponse, hashPassword } = require('../../helpers/')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    login: async (req, res) => {
        try {
            const isUserExists = await userModel.getUserByEmail(req.body)

            // if (isUserExists.length <= 0) {
            //     return baseResponse(res, 404, 'User not found')
            // }

            console.log(isUserExists)

            const passwordUser = req.body.password
            const comparePassword = await bcrypt.compare(passwordUser, isUserExists[0].password)


            if (comparePassword) {
                return baseResponse(res, 200, generateToken(req.body.email, isUserExists[0].role_id))
            } else {
                return baseResponse(res, 404, 'Wrong password!')
            }
        } catch (error) {
            console.log(error)
        }
    },
    register: async (req, res) => {
        try {
            const isUserExists = await userModel.getUserByEmail(req.body)

            if (isUserExists) {
                const { firstName, lastName, phoneNumber, email, password } = req.body
                const passwordEncrypted = await hashPassword(password)

                const data = await userModel.addUser({ firstName, lastName, phoneNumber, email, password: passwordEncrypted, isRegister: true })

                return baseResponse(res, 200, data)
            } else {
                return baseResponse(res, 404, 'User already exists')
            }
        } catch (error) {
            console.log(error)
        }
    },
}

function generateToken(email, role) {
    const payload = {
        email,
        role
    }

    const token = jwt.sign(payload, process.env.JWT_KEYS, { expiresIn: '8h' })

    return {
        token,
        message: 'Token created!'
    }
}
