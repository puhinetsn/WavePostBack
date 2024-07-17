const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Worker } = require("../models/models");
const router = express.Router();
const  restrictAccess  = require('../routes/security');

router.use('/register', restrictAccess('Admin'))

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
        return res.status(404).send({
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
        maxAge: 24 * 60 * 60 * 1000
    })

    res.send({
        message: 'Success'
    });
});


router.post('/logout', async (req, res) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({
        message: 'Success'
    });
})

module.exports = router