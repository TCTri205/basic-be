// import fs from 'fs'

// export const home = (req, res) => {
//     const id = req.params.id

//     fs.readFile('data.json', 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).send('Error reading data file')
//         }

//         const users = JSON.parse(data)
//         const user = users.find((u) => u.id === Number(id))

//         if (!user) {
//             return res.status(404).send('User not found')
//         }

//         res.render('index', { name: user.name, age: user.age })
//     })
// }

import * as UserService from '../services/user.service.js'

export const home = (req, res) => {
    const id = req.params.id

    res.render('index', { name: 'Tri', age: 20 })
}

export const home_id = async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserService.getUser(id) // lấy từ data.json

        if (!user) {
            return res.status(404).send('User not found')
        }

        res.render('index', {
            name: user.name,
            age: user.age || 18, // nếu không có age trong JSON thì mặc định là 18
        })
    } catch (err) {
        res.status(500).send('Internal server error')
    }
}
