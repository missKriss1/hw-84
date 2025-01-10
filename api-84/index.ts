import express from 'express';
import mongoose from "mongoose";
import userRouter from "./routers/users";

const app = express();
const port = 8000;
app.use(express.json());
app.use(express.static("public"));

app.use('/users', userRouter)

const run = async () => {
    await mongoose.connect('mongodb://localhost/toDoList');

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(console.error);