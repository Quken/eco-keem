const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const router = require('./server/router');

const app = express();

const corsMiddleware = require('./server/middlewares/cors');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(corsMiddleware);

app.use('/public', express.static(path.join(__dirname, 'server', 'public')));

app.use('/', router);

// if (process.env.NODE_ENV === 'production') {
app.use(express.static(path.join(__dirname, 'client', 'build')));
// }

const PORT = config.get('port') || 8080;

app.listen(PORT, () => console.log(`Eco app listening on port ${PORT}!`));
