const express = require("express");
const bcrypt = require('bcryptjs');
const { Worker } = require("../models/models");
const jwt = require('jsonwebtoken');

const restrictAccess = (...roles) => {
    return async (req, res, next) => {
        try {
            const cookie = req.cookies['jwt']

            const claims = jwt.verify(cookie, 'secret')

            if (!claims) {
                return res.status(401).send({
                    message: 'User is not authenticated'
                })
            }

            const user = await Worker.findOne({_id: claims._id})

            if (!roles.includes(user.position)) {
                return res.status(403).send({
                    message: "User don't have the required role"
                })
            }
            next();
        } catch
            (e) {
            return res.status(401).send({
                message: 'User is not authenticated'
            })
        }
    }
}

module.exports = restrictAccess