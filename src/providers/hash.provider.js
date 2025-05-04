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
}

export default new HashProvider()
