const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser')

const app = express();
const HOST =process.env.HOST || localhost
const PORT = process.env.PORT || 5000;

// app.use(express.json());
app.use(bodyParser.json());
app.use('/', routes);

app.listen(PORT, () => console.log(`Server running ${HOST} ${PORT}`));
