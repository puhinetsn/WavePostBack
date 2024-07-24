const express = require("express");
const { Assignment } = require("../models/models");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       required:
 *         - name
 *         - payment
 *       properties:
 *         name:
 *           type: string
 *           description: The name of a task
 *         payment:
 *           type: number
 *           description: The payment for task execution
 *       example:
 *         name: Mail Management
 *         payment: 200
 */

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: The task managing API
 * /tasks:
 *   get:
 *     summary: Get all kinds of tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: The tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 * /tasks/{id}:
 *   get:
 *     summary: Get task by its id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task's id
 *         example: 6693eec1c2cf864b2764bfab
 *     responses:
 *       200:
 *         description: The tasks info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Assignment'
 */

router.get("/", async (req, res) => {
    const allTasks = await Assignment.find();
    return res.status(200).json(allTasks);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const taskName = await Assignment.findOne({'_id': id});
    return res.status(200).json(taskName);
});

module.exports = router;
