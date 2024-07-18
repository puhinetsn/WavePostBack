const express = require("express");
const { Address, Worker } = require("../models/models");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - id
 *         - address
 *       properties:
 *         id:
 *           type: number
 *           description: Id of the address
 *         address:
 *           type: string
 *           description: Address of the department
 *       example:
 *         id: 1
 *         address: Naukova, 10
 */

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: The departments managing API
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all department addresses
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: The departments' addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 */

/**
 * @swagger
 * /departments/{id}/workers:
 *   get:
 *     summary: Get the workers by department's id
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The department's id
 *         example: 2
 *     responses:
 *       200:
 *         description: The workers in the department
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Worker'
 */

router.get("/", async (req, res) => {
    const allDepartments = await Address.find();
    return res.status(200).json(allDepartments);
});

router.get('/:id/workers', async (req, res) => {
    const { id } = req.params;
    const allWorkers = await Worker.find({'departmentId': id});
    return res.status(200).json(allWorkers);
});

module.exports = router;
