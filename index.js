// implement your API here
const express = require('express');

const server = express();

server.get('/', (req, res) => {
    res.send('Hello World');
});



server.listen(4000, () => console.log('API running on port 4000'));