const mongoose = require('mongoose');
const { CONFIG } = require('../constants/app.constant');

let ConnectionDB;

if (CONFIG.mongo.variable === "Production") {
  const mongodbConnectionUrl = `mongodb${CONFIG.mongo.port ? '' : '+srv'}://${CONFIG.mongo.username
    }:${CONFIG.mongo.password}@${CONFIG.mongo.host}${CONFIG.mongo.port ? ':'.concat(CONFIG.mongo.port.toString()) : ''
    }/${CONFIG.mongo.dbName}`;

  const options = {
    autoIndex: true,
  };

  if (CONFIG.mongo.username && CONFIG.mongo.password) {
    options.user = CONFIG.mongo.username;
    options.pass = CONFIG.mongo.password;
    options.authSource = CONFIG.mongo.authSource;
    options.readPreference = 'primary';
    if (CONFIG.mongo.isSSL === 'true') {
        (options.ssl = true);
        (options.sslValidate = false);
        (options.tlsInsecure = true);
      if (CONFIG.mongo.caFile) {
        options.sslCA = CONFIG.mongo.caFile;
      }
    }
  }

  ConnectionDB = async () => {
    try {
      await mongoose.connect(mongodbConnectionUrl, options);
      console.log("Database is connected of Production...!");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  };
} else if(CONFIG.mongo.variable === "Staging") {
  ConnectionDB = async () => {
    try {
      await mongoose.connect(CONFIG.mongo.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database is connected of Staging...!");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  };
} else {
  ConnectionDB = async () => {
    try {
      await mongoose.connect(CONFIG.mongo.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database is connected of Local...!");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  };
}

module.exports = {
  ConnectionDB,
};