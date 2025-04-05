import express from 'express'
import fs from 'fs' // Sử dụng fs module để thao tác với file
const app = express()
const port = 3000
app.use(express.json())

// Đọc danh sách người dùng từ file src/users.json
let user = []
const loadUsers = () => {
    try {
        const data = fs.readFileSync('src/users.json', 'utf-8')
        user = JSON.parse(data)
    } catch (err) {
        console.error('Error reading src/users.json:', err)
        user = [] // Nếu có lỗi, khởi tạo lại danh sách rỗng
    }
}

// Lấy dữ liệu người dùng từ file mỗi khi server khởi động
loadUsers()

// Hàm kiểm tra dữ liệu hợp lệ
const validateUser = (userData) => {
    if (!userData.id || !userData.name) {
        return false
    }
    if (typeof userData.id !== 'number' || typeof userData.name !== 'string') {
        return false
    }
    return true
}

app.post('/user', (req, res) => {
    const { id, name } = req.body

    // Kiểm tra validation
    if (!validateUser(req.body)) {
        return res.status(400).json({ error: 'Invalid data' })
    }

    // Thêm người dùng vào danh sách
    user.push({ id, name })

    // Cập nhật vào file src/users.json
    fs.writeFileSync('src/users.json', JSON.stringify(user, null, 2))

    res.status(201).json(user)
})

app.get('/user', (req, res) => {
    res.json(user)
})

app.get('/user/:id', (req, res) => {
    const tmp = user.find((user) => user.id === parseInt(req.params.id))

    if (!tmp) {
        return res.status(404).json({ error: 'User not found' })
    }

    res.json(tmp)
})

app.patch('/user/:id', (req, res) => {
    const { id } = req.params
    const { name } = req.body

    const tmp = user.find((u) => u.id === parseInt(id))

    if (!tmp) {
        return res.status(404).json({ error: 'User not found' })
    }

    tmp.name = name

    // Cập nhật vào file src/users.json
    fs.writeFileSync('src/users.json', JSON.stringify(user, null, 2))

    res.json(tmp)
})

app.delete('/user/:id', (req, res) => {
    const { id } = req.params

    const userIndex = user.findIndex((u) => u.id === parseInt(id))

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' })
    }

    // Xóa người dùng khỏi danh sách
    user.splice(userIndex, 1)

    // Cập nhật vào file src/users.json
    fs.writeFileSync('src/users.json', JSON.stringify(user, null, 2))

    res.json(user)
})

app.get(
    '/hello',
    (req, res, next) => {
        if (req.body.name === 'tct') {
            return next()
        }
        res.send('Hello world')
    },
    (req, res, next) => {
        res.send('Hello' + req.body.name)
    }
)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
