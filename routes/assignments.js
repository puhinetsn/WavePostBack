const express = require("express");
const { Assignment, AssignmentInfo } = require("../models");
const router = express.Router();

router.get("/", async (req, res) => {
    const worker = req.query.worker;
    const department = req.query.department;
    const page = req.query.page;
    const size = req.query.size;
    const filter = {};
    if (worker !== null) {
        filter['worker.lastName'] = new RegExp('^' + worker, 'i');
    } else if (department !== null) {
        filter['departmentId'] = department;
    }
    const workerAssignments = await Assignment.find(filter).limit(size).skip(page * size);

    return res.status(200).json({
        res: workerAssignments,
        hasNext: AssignmentInfo.countDocuments(filter) > ((page + 1) * size)
    });
});


router.post("/", async (req, res) => {
    const newAssignment = new Assignment({...req.body});
    const insertedAssignment = await newAssignment.save();
    return res.status(201).json(insertedAssignment);
});

module.exports = router