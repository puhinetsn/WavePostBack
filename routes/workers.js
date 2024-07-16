const express = require("express");
const { Assignment, Worker } = require("../models");
const router = express.Router();

router.get("/:id/assignments", async (req, res) => {
    const { id } = req.params;
    const page = req.query.page;
    const size = req.query.size;
    const filter = {'workers._id': id};
    const workerAssignments = await Assignment.find(filter).limit(size).skip(page * size);

    return res.status(200).json({
        res: workerAssignments,
        hasNext: AssignmentInfo.countDocuments(filter) > ((page + 1) * size)
    });
});

router.post("/", async (req, res) => {
    const newWorker = new Worker({...req.body});
    const insertedWorker = await newWorker.save();
    return res.status(201).json(insertedWorker);
});

module.exports = router