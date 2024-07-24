const express = require("express");
const {Assignment, AssignmentInfo} = require("../models/models");
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
 * /assignments/count:
 *   get:
 *     summary: Count of all assignments of selected department(or all if not specified) where last name of one of workers starts with worker parameter value
 *     tags: [Assignments]
 *     parameters:
 *         - in: query
 *           name: departmentId
 *           schema:
 *             type: integer
 *           required: false
 *           description: Numeric ID of the department of assignments to be counted
 *           example: 1
 *         - in: query
 *           name: worker
 *           schema:
 *             type: string
 *           required: false
 *           description: Starting part of the last name of a workers which assignments needs to be counted
 *           example: Kov
 *     responses:
 *       200:
 *         description: The count of specified assignment returned
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *               example: 100
 * /assignments:
 *   get:
 *     summary: The list of all the assignments of selected department (or all if not specified)
 *             where last name of one of workers starts with worker parameter value with pagination
 *     tags: [ Assignments ]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         required: true
 *         description: A page from with data is returned. Starts from 0
 *         example: 0
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *         required: true
 *         description: A size of the page
 *         example: 20
 *       - in: query
 *         name: department
 *         schema:
 *           type: integer
 *         required: false
 *         description: Numeric ID of the department of assignments to be found
 *         example: 1
 *       - in: query
 *         name: worker
 *         schema:
 *           type: string
 *         required: false
 *         description: Starting part of the last name of a workers which assignments needs to be found
 *         example: Kov
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

router.get("/count", async (req, res) => {
    const worker = req.query.worker;
    const department = req.query.department;
    const filter = {};
    if (worker !== undefined) {
        filter['workers.lastName'] = new RegExp('^' + worker, 'i');
    }
    if (department !== undefined) {
        filter['departmentId'] = department;
    }
    const count = await AssignmentInfo.countDocuments(filter);
    return res.status(200).json(count);
});

router.get("/", async (req, res) => {
    const worker = req.query.worker;
    const department = req.query.department;
    const page = req.query.page;
    const size = req.query.size;
    const filter = {};
    if (worker !== undefined) {
        filter['workers.lastName'] = new RegExp('^' + worker, 'i');
    }
    if (department !== undefined) {
        filter['departmentId'] = department;
    }
    const workerAssignments = await AssignmentInfo.find(filter).sort({"startDate": -1}).limit(size).skip(page * size);
    const count = await AssignmentInfo.countDocuments(filter);

    return res.status(200).json({
        res: workerAssignments,
        hasNext: count > ((page + 1) * size)
    });
});

router.post("/", async (req, res) => {
    const newAssignment = new AssignmentInfo({...req.body});
    const insertedAssignment = await newAssignment.save();
    return res.status(201).json(insertedAssignment);
});

module.exports = router