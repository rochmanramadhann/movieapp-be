const multer = require('multer')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '/public/images')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = new Date().toISOString() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.originalname + '-' + uniqueSuffix)
//     }
// })

const storage = multer.diskStorage({
    destination: 'public/images',
    filename: (req, file, cb) => {
        const uniqueSuffix = new Date().toISOString() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const uploads = multer({
    storage: storage,
    fileFilter: fileFilter,
})

module.exports = uploads
