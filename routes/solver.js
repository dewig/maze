const express = require('express');
const router = express.Router();
const solver = require("../main/maze-solver");
const solver2 = require("../main/maze-solver.v2");
const {validate} = require("../main/utils");

router.post('/', (req, res, next) => {
    const data = req.body;

    if (validate(data)) {
        try {
            res.send({path: solver(data)});
        } catch (e) {
            res.status(500);
            res.send({error: "there was an error while processing"});
        }
    } else {
        res.status(400);
        res.send({error: "invalid data"});
    }
});

router.post('/v2', (req, res, next) => {
    const data = req.body;

    if (validate(data)) {
        try {
            res.send({path: solver2(data)});
        } catch (e) {
            res.status(500);
            res.send({error: "there was an error while processing"});
        }
    } else {
        res.status(400);
        res.send({error: "invalid data"});
    }
});

module.exports = router;
