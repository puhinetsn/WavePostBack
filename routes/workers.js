const express = require("express");
const { Worker, AssignmentInfo } = require("../models/models");
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get("/assignments", async (req, res) => {
    const cookie = req.cookies['jwt']
    const claims = jwt.verify(cookie, 'secret')

    const page = req.query.page;
    const size = req.query.size;
    const filter = {'workers._id':  claims._id};
    const workerAssignments = await AssignmentInfo.find(filter).limit(size).skip(page * size);

    return res.status(200).json({
        res: workerAssignments,
        hasNext: AssignmentInfo.countDocuments(filter) > ((page + 1) * size)
    });
});

router.get('/', async (req, res) => {
    const cookie = req.cookies['jwt']
    const claims = jwt.verify(cookie, 'secret')
    const user = await Worker.findOne({_id: claims._id});

    const {password, ...data} = await user.toJSON()
    return res.send(data);
})
module.exports = router