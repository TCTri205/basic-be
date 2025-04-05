import express from 'express'
import fs from 'fs' // Sử dụng fs module để thao tác với file
const app = express()
const port = 3000
app.use(express.json())

// Đọc danh sách người dùng từ file src/users.json
let user = []

// Hàm loadUsers an toàn hơn với xử lý lỗi chi tiết
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
    return (
        userData &&
        typeof userData.id === 'number' &&
        typeof userData.name === 'string' &&
        userData.name.trim() !== ''
    )
}

app.post('/user', (req, res) => {
    const { id, name } = req.body

    // Kiểm tra validation
    if (!validateUser(req.body)) {
        return res.status(400).json({ error: 'Invalid data' })
    }

    // Kiểm tra xem ID đã tồn tại hay chưa
    if (user.find((u) => u.id === id)) {
        return res
            .status(400)
            .json({ error: 'User with this ID already exists' })
    }

    // Thêm người dùng vào danh sách
    user.push({ id, name })

    // Cập nhật vào file src/users.json
    try {
        fs.writeFileSync('src/users.json', JSON.stringify(user, null, 2))
    } catch (err) {
        console.error('Error writing to src/users.json:', err)
        return res.status(500).json({ error: 'Failed to save data' })
    }

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

    // Kiểm tra xem có thay đổi tên hay không
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid name' })
    }

    // Cập nhật tên
    tmp.name = name

    // Cập nhật vào file src/users.json
    try {
        fs.writeFileSync('src/users.json', JSON.stringify(user, null, 2))
    } catch (err) {
        console.error('Error writing to src/users.json:', err)
        return res.status(500).json({ error: 'Failed to save data' })
    }

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
    try {
        fs.writeFileSync('src/users.json', JSON.stringify(user, null, 2))
    } catch (err) {
        console.error('Error writing to src/users.json:', err)
        return res.status(500).json({ error: 'Failed to save data' })
    }

    res.json(user)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
