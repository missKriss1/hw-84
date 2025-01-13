import express from 'express';
import mongoose from "mongoose";
import userRouter from "./routers/users";
import tasksRouter from "./routers/tasks";
import config from "./config";

const app = express();
const port = 8000;
app.use(express.json());
app.use(express.static("public"));

app.use('/users', userRouter)
app.use('/tasks', tasksRouter)

const run = async () => {
   await mongoose.connect(config.db)

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(console.error);