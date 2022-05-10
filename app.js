// file entry point for the application to initialize the app/modules
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./src/routers')
const db = require('./src/configs/db')
const cors = require('cors')

const server = express()
const PORT = 9000

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
server.use(bodyParser.json())

server.use(cors())
server.use('/public', express.static('public'))
server.use('/api/v1', router)
// server.use(express.urlencoded({ extended: false }))
// server.use(express.json)

db.connect()
    .then(() => {
        console.log('Database Connected!')

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }).catch((err) => {
        console.log(err)
    })
