import bcrypt from 'bcryptjs'

class HashProvider {
    async generateHash(plainText) {
        const salt = await bcrypt.genSalt(10)
        const hashString = await bcrypt.hash(plainText, salt)
        return hashString
    }

    async compareHash(plainText, hashString) {
        const isMatch = await bcrypt.compare(plainText, hashString)
        return isMatch
    }

    async generateRandomToken() {
        const randomBytes = await bcrypt.genSalt(16) // 16 bytes of random data
        const token = randomBytes.toString('hex') // Convert to hex string
        return token
    }
}

export default new HashProvider()
