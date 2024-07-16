const express = require("express");
const mongoose = require('mongoose');

//const {Worker, Address, Assignment, AssignmentInfo} = require("./models");
const app = express();
const port = 3000;

const departmentsRouter = require('./routes/departments');
app.use('/api/departments', departmentsRouter);

const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

const workersRouter = require('./routes/workers');
app.use('/api/workers', workersRouter);

const assignmetsRouter = require('./routes/assignments');
app.use('/api/assignments', assignmetsRouter);

app.use(express.json());
const uri = "mongodb+srv://puhinetsn82:pQfIEYc31Ykj3kFD@clusterpuhinets.hjgmsud.mongodb.net/wavepost?retryWrites=true&w=majority&appName=ClusterPuhinets";
mongoose.connect(uri);


app.listen(3000, () => console.log(`Server started on port ${port}`));