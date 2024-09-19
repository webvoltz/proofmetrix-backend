const CONFIG = {
    mongo: {
        host: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        authSource: process.env.DB_AUTH_SOURCE,
        caFile: process.env.DB_CA_FILE,
        isSSL: process.env.DB_SSL,
        variable: process.env.VARIABLE,
        uri: process.env.MONGO_URL
    }
}

module.exports = { CONFIG }