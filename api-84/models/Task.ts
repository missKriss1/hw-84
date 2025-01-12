import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'User is required'],

    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        default: null
    },
    status:{
        type: String,
        enum: ["new", "in_progress", "complete"],
    }
})

const Task = mongoose.model('Task', TaskSchema);

export default Task;