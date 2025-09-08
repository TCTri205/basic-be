import express from 'express'
import uploadStorage from '../config/upload.config.js'

const route = express.Router()

// Single file
route.post('/single', uploadStorage.single('file'), (req, res) => {
    // console.log(req.file)
    // return res.send('Single file')
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})
//Multiple files
route.post('/multiple', uploadStorage.array('file', 12), (req, res) => {
    // console.log(req.files)
    // return res.send('Multiple files')
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

// route.post('/uploadphoto', uploadStorage.single('picture'), (req, res) => {
//     var img = fs.readFileSync(req.file.path)
//     var encode_image = img.toString('base64')
//     // Define a JSONobject for the image attributes for saving to database

//     var finalImg = {
//         contentType: req.file.mimetype,
//         image: new Buffer(encode_image, 'base64'),
//     }
//     db.collection('quotes').insertOne(finalImg, (err, result) => {
//         console.log(result)

//         if (err) return console.log(err)

//         console.log('saved to database')
//         res.redirect('/')
//     })
// })

// route.get('/photos', (req, res) => {
//     db.collection('mycollection')
//         .find()
//         .toArray((err, result) => {
//             const imgArray = result.map((element) => element._id)
//             console.log(imgArray)

//             if (err) return console.log(err)
//             res.send(imgArray)
//         })
// })

// route.get('/photo/:id', (req, res) => {
//     var filename = req.params.id

//     db.collection('mycollection').findOne(
//         { _id: ObjectId(filename) },
//         (err, result) => {
//             if (err) return console.log(err)

//             res.contentType('image/jpeg')
//             res.send(result.image.buffer)
//         }
//     )
// })

export default route
