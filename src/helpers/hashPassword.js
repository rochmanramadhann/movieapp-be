const bcrypt = require('bcrypt')

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10)
        const result = await bcrypt.hash(password, salt)
        return result
    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = hashPassword 
