const express = require("express");
const { Worker, AssignmentInfo } = require("../models/models");
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Worker:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - middleName
 *         - position
 *         - rate
 *         - departmentId
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of a worker
 *         lastName:
 *           type: string
 *           description: The last name of a worker
 *         middleName:
 *           type: string
 *           description: The middle name of a worker
 *         position:
 *           type: string
 *           description: The position the worker works on
 *         rate:
 *           type: number
 *           description: The employee's monthly salary
 *         departmentId:
 *           type: number
 *           description: Id of the employee's place of work
 *         email:
 *           type: string
 *           description: The employee's email address
 *         password:
 *           type: string
 *           writeOnly: true
 *           description: The employee's password
 *       example:
 *         firstName: Mykola
 *         lastName: Shpak
 *         middleName: Volodymyrovych
 *         position: Worker
 *         rate: 10500
 *         departmentId: 2
 *         email: mykolamykolayenko@wavepost.com
 *         password: testpass
 */

/**
 * @swagger
 * tags:
 *   name: Workers
 *   description: The workers managing API
 */

/**
 * @swagger
 * /workers/assignments:
 *   get:
 *     summary: Get all tasks assigned to a specific post office employee
 *     tags: [Workers]
 *     responses:
 *       200:
 *         description: The list of employees assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AssignmentInfo'
 */

/**
 * @swagger
 * /workers/:
 *   get:
 *     summary: Return employee information
 *     tags: [Workers]
 *     responses:
 *       200:
 *         description: The user's data is returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 */

router.get("/assignments", async (req, res) => {
    const cookie = req.cookies['jwt'];
    const claims = jwt.verify(cookie, 'secret');

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
    const cookie = req.cookies['jwt'];
    const claims = jwt.verify(cookie, 'secret');
    const id = claims._id;

    const bonus = await AssignmentInfo.aggregate([
            {
                $match: {
                    'workers._id': new mongoose.Types.ObjectId(id),
                    $expr: {
                        $and: [
                            {$eq: [{$year: '$startDate'}, new Date().getFullYear()]},
                            {$eq: [{$month: '$startDate'}, new Date().getMonth() + 1]}
                        ]
                    }
                }
            },
            {$group: {_id: null, sum: {$sum: $type.payment}}}
        ]
    );

    const user = await Worker.findOne({_id: id}).lean();
    if (bonus.length) {
        user.bonus = bonus[0].sum;
    } else {
        user.bonus = 0;
    }

    const {password, ...data} = user;
    return res.send(data);
});

module.exports = router;
