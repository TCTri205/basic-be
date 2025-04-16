import fs from "fs/promises"

export const readAllUsers = async (dataFile) => {
    try {
        const data = await fs.readFile(dataFile)
        return JSON.parse(data)
    } catch (err) {
        throw new Error("Failed to read or parse data file")
    }
}

export const writeUserToFile = async (dataFile, users) => {
    try {
        await fs.writeFile(dataFile, JSON.stringify(users, null, 1))
    } catch (err) {
        throw new Error("Failed to write data file")
    }
}
