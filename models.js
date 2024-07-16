const mongoose = require('mongoose');

const Worker = mongoose.model('Worker', new mongoose.Schema({
    firstName: String,
    lastName: String,
    middleName: String,
    position: String,
    rate: Number,
    departmentId: Number
}));

const Address = mongoose.model('Address', new mongoose.Schema({
    _id: Number,
    departmentAddress: String
}));

const Assignment = mongoose.model('Assignment', new mongoose.Schema({
    name: String,
    payment: Number
}));

const WorkerInfo = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    firstName: String,
    lastName: String,
    middleName: String
});

const AssignmentInfo = mongoose.model('AssignmentInfo', new mongoose.Schema({
    type: Assignment.schema,
    workers: [WorkerInfo],
    duration: Number,
    startDate: Date,
    exequtorsQty: Number,
    departmentId: Number,
    description: String
}));

module.exports = {Worker, Address, Assignment, AssignmentInfo};