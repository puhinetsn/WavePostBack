const express = require("express");
const { Assignment, AssignmentInfo} = require("../models/models");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AssignmentInfo:
 *       type: object
 *       required:
 *         - type
 *         - workers
 *         - duration
 *         - startDate
 *         - exequtorsQty
 *         - departmentId
 *         - description
 *       properties:
 *         type: 
 *           $ref: '#/components/schemas/Assignment'
 *           description: The type of a task
 *         workers:
 *           type: array
 *           description: The list of tasks' executors
 *           items:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *         duration:
 *           type: number
 *           description: The duration of tasks' execution
 *         startDate:
 *           type: string
 *           format: date
 *           description: The date the task starts
 *         exequtorsQty:
 *           type: number
 *           description: The number of executors
 *         departmentId:
 *           type: number
 *           description: The ID of the department
 *         description:
 *           type: string
 *           description: The task's description
 *       example:
 *         type:
 *           name: Parcel Dispatch
 *           payment: 300
 *         workers:
 *           - firstName: Oleksandr
 *             lastName: Shevchenko
 *             middleName: Ivanovych
 *         duration: 1
 *         startDate: "2024-07-10T04:05:06.157Z"
 *         exequtorsQty: 1
 *         departmentId: 1
 *         description: Dispatch typically refers to the process of sending out or distributing parcels or packages from a distribution center, warehouse, or post office to their intended recipients.
 */

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: The assignments managing API
 * /assignments:
 *   get:
 *     summary: The list of all the assignments
 *     tags: [Assignments]
 *     responses:
 *       200:
 *         description: The list of all the assignments is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 res:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AssignmentInfo'
 *                 hasNext:
 *                   type: boolean
 *   post:
 *     summary: Add a new assignment
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentInfo'
 *     responses:
 *       201:
 *         description: The assignment is created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignmentInfo'
 */

router.get("/", async (req, res) => {
    const worker = req.query.worker;
    const department = req.query.department;
    const page = req.query.page;
    const size = req.query.size;
    const filter = {};
    if (worker !== undefined) {
        filter['worker.lastName'] = new RegExp('^' + worker, 'i');
    }
    if (department !== undefined) {
        filter['departmentId'] = department;
    }
    const workerAssignments = await AssignmentInfo.find(filter).limit(size).skip(page * size);

    return res.status(200).json({
        res: workerAssignments,
        hasNext: AssignmentInfo.countDocuments(filter) > ((page + 1) * size)
    });
});

router.post("/", async (req, res) => {
    const newAssignment = new AssignmentInfo({...req.body});
    const insertedAssignment = await newAssignment.save();
    return res.status(201).json(insertedAssignment);
});

module.exports = router