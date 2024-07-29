const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { specs, swaggerUi } = require('./swagger');
const  restrictAccess  = require('./routes/security');
const app = express();

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'https://puhinetsn.github.io'
}))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.use(express.json());
const port = 3000;

const departmentsRouter = require('./routes/departments');
app.use('/api/departments', restrictAccess('Admin'), departmentsRouter);

const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', restrictAccess('Admin'), tasksRouter);

const workersRouter = require('./routes/workers');
app.use('/api/workers', restrictAccess('Admin', 'Worker'), workersRouter);

const assignmentsRouter = require('./routes/assignments');
app.use('/api/assignments', restrictAccess('Admin'), assignmentsRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const uri = "mongodb+srv://puhinetsn82:pQfIEYc31Ykj3kFD@clusterpuhinets.hjgmsud.mongodb.net/wavepost?retryWrites=true&w=majority&appName=ClusterPuhinets";
mongoose.connect(uri);

app.listen(port, () => console.log(`Server started on port ${port}`));
