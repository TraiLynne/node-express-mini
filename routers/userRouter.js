const express = require('express');

const router = express.Router();
const db = require('../data/db');

router.use(express.json());

// C - Create
router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
    try {
        let users = await db.find();
        res
            .status(200)
            .json(users);
        
    } catch (err) {
        res
            .status(500)
            .json({
                error: "The users information could not be retrieved."
            });
    }

});

router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
    } catch (err) {
        res
            .status(500)
            .json({
                error: "The user could not be removed"
            });
    }
});

module.exports = router;