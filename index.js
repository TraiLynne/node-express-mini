// implement your API here
const express = require('express');

const server = express();
const port = 4000;

const db = require('./data/db')

server.get('/', (req, res) => {
    res.send('Hello World');
});

server.get('/sins', (req, res) => {
    const sins = [
        {
            id: 1,
            name: 'Meliodas'
        },
        {
            id: 2,
            name: 'Liz'
        },
        {
            id: 3,
            name: 'Diana'
        },
        {
            id: 4,
            name: 'Ban'
        },
        {
            id: 5,
            name: 'King'
        },
        {
            id: 6,
            name: 'Gowther'
        },
        {
            id: 7,
            name: 'Merlin'
        },
        {
            id: 8,
            name: 'Escobar'
        }
    ];

    res
        .status(200)
        .json(sins);
});


server.get('/users', (req, res) => {
    db
        .find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).send('Error Occurred. Please Try Again')
        });
});

server.listen(port, () => console.log('API running on port 4000'));