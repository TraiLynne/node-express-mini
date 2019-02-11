// const http = require('http'); // Built in with node.js to handle http traffic
const express = require('express');
const server = express();

const port = 4000; // Port watching for traffic

const db = require('./data/db');
const mainRouter = require('./routers');

server.use(express.json());

server.use('/api', mainRouter);

server.listen(port, () => console.log('API running on port 4000'));