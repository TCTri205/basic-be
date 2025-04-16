import path from 'path';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templateEngineConfig = (app) =>{
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
    // app.set('views, './views');
}
export default templateEngineConfig;