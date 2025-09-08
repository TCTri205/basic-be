// import authProvider from '../providers/auth.provider.js'
// import AuthService from '../services/auth.service.js'

// class VerifyMiddleware {
//     async checkAuth(req, res, next) {
//         try {
//             const header = req.headers['authorization']
//             console.log('> Authorization header:', header)

//             // if (!header) {
//             //     // return res.status(401).json({ message: 'Unauthorized' })
//             //     throw new Error('Not login yet')
//             // }

//             if (!header || !header.startsWith('Bearer ')) {
//                 return res.status(401).json({
//                     message: 'Missing or malformed Authorization header',
//                 })
//             }

//             // const token = header.split(' ')[1]
//             const token = header.slice(7).trim()
//             console.log('> Extracted token:', token)

//             const data = await authProvider.decodeToken(token)
//             req.user = data.id
//             next()
//         } catch (error) {
//             // return res.status(403).json({ message: 'Forbidden' })
//             next(error)
//         }
//     }
// }
// export default new VerifyMiddleware()

import authProvider from '../providers/auth.provider.js'

const JWT_AUTH_ERROR = 'Invalid or expired token'

class VerifyMiddleware {
    /**
     * Middleware dùng để xác thực người dùng dựa trên JWT.
     * - Kỳ vọng Header: Authorization: Bearer <token>
     * - Sau khi verify, gán req.user = { id: <userId>, ... } (tùy payload)
     *
     * Nếu thiếu hoặc sai header, trả về 401.
     * Nếu token không hợp lệ, trả về 401.
     */
    async checkAuth(req, res, next) {
        try {
            const header = req.headers['authorization'] || ''
            console.log('> Authorization header:', header)

            // 1. Kiểm tra existence & format của header
            if (!header.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'Missing or malformed Authorization header',
                })
            }

            // 2. Tách token ra
            const token = header.slice(7).trim()
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Missing token',
                })
            }
            console.log('> Extracted token:', token)

            // 3. Giải mã token
            let payload
            try {
                payload = await authProvider.decodeToken(token)
            } catch (err) {
                console.error('🔒 Token decode error:', err)
                return res.status(401).json({
                    success: false,
                    message: JWT_AUTH_ERROR,
                })
            }

            // 4. Nếu payload không có ID (hoặc info cần thiết), coi là token không hợp lệ
            if (!payload || !payload.id) {
                return res.status(401).json({
                    success: false,
                    message: JWT_AUTH_ERROR,
                })
            }

            // 5. Gán req.user để controller có thể dùng
            //    Payload có thể bao gồm: { id, email, role, ... }
            req.user = {
                id: payload.id,
                email: payload.email || null,
                role: payload.role || 'user',
            }

            // Cho phép tiếp tục xuống controller
            next()
        } catch (error) {
            console.error('🔒 Auth middleware unexpected error:', error)
            return res.status(500).json({
                success: false,
                message: 'Internal server error during authentication',
            })
        }
    }
}

export default new VerifyMiddleware()
