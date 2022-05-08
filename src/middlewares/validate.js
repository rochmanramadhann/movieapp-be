const baseResponse = require('../helpers/base_response')
const jwt = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    const {auth_token} = req.headers

    if (!auth_token) {
        return baseResponse(res, 401, {message : 'Silahkan login terlebih dahulu'})
    }

    jwt.verify(auth_token, process.env.JWT_KEYS, (error, decode) => {
        if (error) {
            return baseResponse(res, 401, error)
        }

        req.users = decode
        next()
    })
}

module.exports = validateToken