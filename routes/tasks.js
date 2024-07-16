const express = require("express");
const { Assignment } = require("../models");
const router = express.Router();

router.get("/", async (req, res) => {
    const allTasks = await Assignment.find();
    return res.status(200).json(allTasks);
});

module.exports = router