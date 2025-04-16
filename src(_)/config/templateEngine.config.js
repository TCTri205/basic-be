import path from 'path'

const templateEngineConfig = (app) => {
    app.set('view engine', 'ejs'),
        app.set('views', path.join(__dirname, '../views'))
}

export default templateEngineConfig
