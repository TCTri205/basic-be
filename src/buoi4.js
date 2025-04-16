import express from 'express'

const app = express();
const port = 3000;
const user = {
    name: 'thanhtu',
    age: 21,
    school: 'dut'
}
// app.get('/hello',
//     (req, res, next) => {
//         user.name = 'hanhnguyen';
//         return next()
//     },
//     (req, res, next) => {
//         res.send(user)
//     }
// )
// app.post('/hello', 
//     (req, res, next) => {
//         const user = req.body
//         user.name = 'hanhnguyen'
//         req.user = user
//         next()
//     },
//     (req, res, next) => {
//         res.send(req.user)
//     }
// )

// app.post('/hello', 
//     (req, res, next) =>{
//         if(req.query.a === '1'){
//             return next()
//         }
//         res.send('loi roi')
//     },
//     (req, res, next) => {
//         res.send(req.body)
//     }
// )

app.post('/hello', 
    abc,
    (req, res, next) => {
        try{
            const a = 5
            const b = 0
            if(a/b == 1) throw new error
            res.json(a / b)
        }catch(error){
            next(error)
        }
    }
)
app.use('/', (err, req, res, next) =>{
    console.log('Middleware 2')
    console.log('err: ', err)
    res.status(500).send('Something broke!')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
