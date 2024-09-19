const cors = require('cors');
const express = require('express');
const useragent = require('express-useragent');
const morgan = require('morgan');
const { CONSTANT_ROUTES } = require('./constants/route.constants');
const { ConnectionDB } = require('./config/dbConnectionConfig');
const mainRouter = require('./routes/routerConfig/mainRouter.routes');
const { spiltTestCron, dashboardCronTest, splitTestData } = require('./crons/spiltTestMail');
const app = express();

//Connection DB of mongoDB
ConnectionDB();

//Required Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(morgan('tiny'))

app.use(useragent.express());
spiltTestCron();
dashboardCronTest();
splitTestData();

app.use('/assets', express.static('assets'));
app.set('view engine', 'ejs');

app.use("/", mainRouter);

app.listen(CONSTANT_ROUTES.PORT.PORT, () => {
  console.log(`Server is running on http://localhost:${CONSTANT_ROUTES.PORT.PORT}`);
});
