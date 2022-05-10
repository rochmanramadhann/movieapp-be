const baseResponse = require('../helpers/baseResponse')
const jwt = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    const { auth_token } = req.headers

    if (!auth_token) {
        return baseResponse(res, 401, { message: 'Please login first to continue' })
    }

    jwt.verify(auth_token, process.env.JWT_KEYS, (error, decode) => {
        if (error) {
            return baseResponse(res, 401, error)
        }

        req.user = decode
        next()
    })
}

module.exports = validateToken