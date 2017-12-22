require('newrelic');

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const routes = require('./routes');

const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use('/', routes);

const availabilityConsumer = require('./aws/availabilityConsumer');
const updateConsumer = require('./aws/updateConsumer');

availabilityConsumer.start();
updateConsumer.start();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server listening on PORT ${PORT}`));

module.exports = app;
