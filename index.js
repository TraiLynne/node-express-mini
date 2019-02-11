// const http = require('http'); // Built in with node.js to handle http traffic
const express = require('express');
const server = express();

const port = 4000; // Port watching for traffic

const db = require('./data/db');
const mainRouter = require('./routers');

server.use(express.json());

// Custom Middleware


// SINS Logic





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


server.use('/api', mainRouter);

server.listen(port, () => console.log('API running on port 4000'));