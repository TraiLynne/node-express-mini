const express = require('express');

const router = express.Router();

const sinRoutes = require('./sinRouter');
const userRoutes = require('./userRouter');

router.use('/sins', sinRoutes);
router.use('/users', userRoutes);

router.use('/', (req, res) => res.send('Welcome to the Main API'));

module.exports = router;