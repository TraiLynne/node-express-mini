// const http = require('http'); // Built in with node.js to handle http traffic
const express = require('express');
const server = express();

const port = 4000; // Port watching for traffic

const db = require('./data/db');

server.use(express.json());

const sins = [{
        id: 0,
        name: 'Meliodas'
    },
    {
        id: 1,
        name: 'Liz'
    },
    {
        id: 2,
        name: 'Diana'
    },
    {
        id: 3,
        name: 'Ban'
    },
    {
        id: 4,
        name: 'King'
    },
    {
        id: 5,
        name: 'Gowther'
    },
    {
        id: 6,
        name: 'Merlin'
    },
    {
        id: 7,
        name: 'Escobar'
    }
];

let currentId = sins[sins.length - 1].id;

server.get('/', (req, res) => {
    res.send('Hello World, from Express')
});

// C - Create
server.post('/sins', (req, res) => {
    console.log(req.body)
    const sin = req.body;
    sin.id = ++currentId;

    sins.push(sin);

    res
        .status(201)
        .json(sins);
});

// R - Read
server.get('/sins', (req, res) => {
    // query string parameters get added to req.query
    const sortField = req.query.sortby || 'id';
    // apply the sorting
    const sortedSins = sins.sort(
        (a, b) => (a[sortField] < b[sortField] ? -1 : 1)
    );

    res
        .status(200)
        .json(sortedSins);
});

// U - Update
server.put('/sins/:id', (req, res) => {
    const sin = sins.find(s => s.id == req.params.id); //string == number not string === number

    if (!sin) {
        res
            .status(404)
            .json({
                message: 'Sin does not exist'
            });
    } else {
        // modify the existing hobbit
        Object.assign(sin, req.body);

        res
            .status(200)
            .json(sin);
    }
});

// D - Destroy
server.delete('/sins/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.params);
    // or we could destructure it like so: const { id } = req.params;
    res
        .status(200)
        .json({
            url: `/sins/${id}`,
            opeation: `DELETE for hobbit with id ${id}`,
        });
});





// *** ==== USERS PORTION ==== *** //
// C - Create
server.post('/api/users', async (req, res) => {
    const newUser = req.body;
    
    try {
        if (!newUser.name || !newUser.bio) {
            res
                .status(400)
                .json({
                    errorMessage: "Please provide name and bio for the user."
                });
        } else {
            let nextId = await db.insert(newUser);

            newUser.id = nextId.id;
            console.log(newUser);
            res
                .status(201)
                .json(newUser);

        }
    } catch (err) {
        console.log(err);
        res
            .status(500)
            .json({
                error: "There was an error while saving the user to the database"
            });
    }
    
});

// R - READ
server.get('/api/users', (req, res) => {
    db
        .find()
        .then(users => {
            res
                .status(200)
                .json(users);
        })
        .catch(err => {
            res.status(500).json({
                error: "The users information could not be retrieved."
            });
        });
    
});

server.get('/api/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        let user = await db.findById(id);
        console.log(user);

        if (!user) {
            res
                .status(404)
                .json({
                    message: "The user with the specified ID does not exist."
                });
        } else {
            res
                .status(200)
                .json(user);
        }

    } catch (err) {
        res
            .status(500)
            .json({
                error: "The user information could not be retrieved."
            });
    }
});

// U - UPDATE
server.put('/api/users/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        let user = await db.findById(id);
        let updatedUser = req.body;

        if (!user) {
            res
                .status(404)
                .json({
                    message: "The user with the specified ID does not exist."
                });
        } else if (!updatedUser.name | !updatedUser.bio) {
            console.log("Missing info");
            res
                .status(400)
                .json({
                    errorMessage: "Please provide name and bio for the user."
                });
        } else {
            await db.update(id, updatedUser);
            let success = await db.findById(id);
            
            res
                .status(200)
                .json(success);
        }
    } catch (err) {
        console.log(err);
    }
})

// D - DESTROY
server.delete('/api/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        let user = await db.findById(id);

        if (!user) {
            res
                .status(404)
                .json({
                    message: "The user with the specified ID does not exist."
                });
        } else {
            await db.remove(id);
            let users = await db.find();

            res
                .status(200)
                .json(users);
            
        }
    } catch(err) {
        res
            .status(500)
            .json({
                error: "The user could not be removed"
            });
    }
});

server.listen(port, () => console.log('API running on port 4000'));