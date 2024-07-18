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
 *   name: Tasks
 *   description: The task managing API
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
 */

router.get("/", async (req, res) => {
    const allTasks = await Assignment.find();
    return res.status(200).json(allTasks);
});

module.exports = router;
