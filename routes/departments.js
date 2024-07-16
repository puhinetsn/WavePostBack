const express = require("express");
const { Address, Worker} = require("../models");
const router = express.Router();

router.get("/", async (req, res) => {
    const allDepartments = await Address.find();
    return res.status(200).json(allDepartments);
});

router.get('/:id/workers', async (req, res) => {
    const { id } = req.params;
    const allWorkers = await Worker.find({'departmentId': id});
    return res.status(200).json(allWorkers);
});

module.exports = router