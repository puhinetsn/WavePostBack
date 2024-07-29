const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Worker } = require("../models/models");
const router = express.Router();
const  restrictAccess  = require('../routes/security');

router.use('/register', restrictAccess('Admin'))


/**
 * @swagger
 * components:
 *   schemas:
 *     WorkerWithoutPassword:
 *       type: object
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
 *       example:
 *           firstName: Mykola
 *           lastName: Shpak
 *           middleName: Volodymyrovych
 *           position: Worker
 *           rate: 10500
 *           departmentId: 2
 *           email: mykolamykolayenko@wavepost.com
 *     SuccessMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Success
 *     LoginInfo:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: mykolamykolayenko@wavepost.com
 *         password:
 *           type: string
 *           example: testpass
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Worker'
 *     responses:
 *       200:
 *         description: The created worker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerWithoutPassword'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log into account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInfo'
 *     responses:
 *       200:
 *         description: The user is logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Invalid data
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out of account
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 */


router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newWorker = new Worker({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        position: req.body.position,
        rate: req.body.rate,
        departmentId: req.body.departmentId,
        email: req.body.email,
        password: hashedPassword,
    });

    const result = await newWorker.save();

    const {password, ...data} = await result.toJSON();

    res.send(data);
});

router.post('/login', async (req, res) => {
    const user = await Worker.findOne({email: req.body.email});

    if(!user){
        return res.status(400).send({
            message: 'User is not found.'
        })
    }

    if(!await bcrypt.compare(req.body.password, user.password)){
        return res.status(400).send({
            message: 'Invalid data.'
        })
    }

    const token = jwt.sign({_id: user._id}, "secret");
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'None',
        secure: true
    })

    res.send({
        message: 'Success'
    });
});


router.post('/logout', async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        httpOnly: true,
        maxAge: 0,
        sameSite: 'None',
        secure: true
    })

    res.send({
        message: 'Success'
    });
})

module.exports = router