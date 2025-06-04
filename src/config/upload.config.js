import multer from 'multer'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    },
})

const uploadStorage = multer({ storage: storage })

export default uploadStorage
