const express = require('express');

const router = express.Router();

const sins = [
    {
        id: 0,
        name: 'Meliodas',
        bio: 'Dragon Sin of Wrath'
    },
    {
        id: 1,
        name: 'Liz',
        bio: 'Princess of Liones'
    },
    {
        id: 2,
        name: 'Diana',
        bio: 'Serpent Sin of Envy'
    },
    {
        id: 3,
        name: 'Ban',
        bio: 'Fox Sin of Greed'
    },
    {
        id: 4,
        name: 'King',
        bio: 'Bear Sin of Sloth'
    },
    {
        id: 5,
        name: 'Gowther',
        bio: 'Goat Sin of Lust'
    },
    {
        id: 6,
        name: 'Merlin',
        bio: 'Boar Sin of Gluttony'
    },
    {
        id: 7,
        name: 'Escobar',
        bio: 'Lion Sin of Pride'
    }
];

let currentId = sins[sins.length - 1].id;

// C - Create
router.post('/', (req, res) => {
    console.log(req.body)
    const sin = req.body;
    sin.id = ++currentId;

    sins.push(sin);

    res
        .status(201)
        .json(sins);
});

// R - Read
router.get('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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


module.exports = router;