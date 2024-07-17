const mongoose = require('mongoose');

const Worker = mongoose.model('Worker', new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    departmentId: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}));

const Address = mongoose.model('Address', new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    departmentAddress: {
        type: String,
        required: true
    }
}));

const Assignment = mongoose.model('Assignment', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    payment: {
        type: Number,
        required: true
    }
}));

const WorkerInfo = new mongoose.Schema({
    firstName: String,
    lastName: String,
    middleName: String,
});

const AssignmentInfo = mongoose.model('AssignmentInfo', new mongoose.Schema({
    type: {
        type: Assignment.schema,
        required: true
    },
    workers: {
        type: [WorkerInfo],
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    exequtorsQty: {
        type: Number,
        required: true
    },
    departmentId: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}));

module.exports = {Worker, Address, Assignment, AssignmentInfo};