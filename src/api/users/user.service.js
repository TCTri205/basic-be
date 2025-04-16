import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../database/data.json"); 



class UserService{
    readUsersFromFile(callback) {
        fs.readFile(dataFile, (err, data) => {
            if (err) {
                return callback({ error: "Failed to read data file" });
            }
            try {
                const users = JSON.parse(data);
                callback(null, users);
            } catch (parseError) {
                callback({ error: "Failed to parse JSON data" });
            }
        });
    }
    
    
    writeUsersToFile(users, callback) {
        fs.writeFile(dataFile, JSON.stringify(users, null, 1), (err) => {
            if (err) {
                return callback({ error: "Failed to write data file" });
            }
            callback(null);
        });
    }
}
export default new UserService();