import express from "express";
import Task from "../models/Task";
import mongoose from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req, res, next) => {
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;
    if (!user) {
        res.status(400).send({error: 'User not found'});
        return;
    }
   try{
       const newTask = new Task({
           user: user._id,
           title: req.body.title,
           description: req.body.description,
           status: req.body.status,
       })
       await newTask.save();
       res.send(newTask);
   }catch (error){
       if(error instanceof mongoose.Error.ValidationError){
           const ValidationError = Object.keys(error.errors).map(key =>({
               field: key,
               message: error.errors[key].message,
           }))
           res.status(400).send({error: ValidationError});
           return;
       }
       next(error);
   }
})

tasksRouter.get('/',auth,  async (req, res, next) => {
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;
    if (!user) {
        res.status(400).send({error: 'User not found'});
        return;
    }

    try{
        if( !user || !user._id){
            res.status(400).send({error: "User not authenticated"});
        }

        const task = await Task.find({user: user._id});
        res.send(task);
    }catch (error){
        next(error);
    }
})

tasksRouter.delete('/:id', auth, async (req, res, next) => {

    let expressReq = req as RequestWithUser;
    const user = expressReq.user;
    if (!user) {
        res.status(400).send({error: 'User not found'});
        return;
    }
    const taskById = req.params.id;

    try {
        const task = await Task.findById(taskById);

        if(!task){
            res.status(400).send({error: "Task not found"});
            return ;
        }

        if(task.user.toString() !== user._id.toString()){
            res.status(403).send({error: "User does not exist"});
            return ;
        }

        await Task.findByIdAndDelete(taskById)
        res.send({ message: 'Task was deleted' });

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message,
            }));
            res.status(400).send({ error: validationErrors });
            return
        }
        next(error);
    }
});

tasksRouter.put('/:id', auth, async (req, res, next) => {
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;
    if (!user) {
        res.status(400).send({error: 'User not found'});
        return;
    }

    const taskById = req.params.id;

    try{
        if(!taskById){
           res.status(400).send({error: "Id params mist be in url"});
           return;
        }

        const task = await Task.findById(taskById);

        if(!task) {
            res.status(400).send({error: "Task not found"});
            return;
        }

        if( task.user.toString() !== user._id.toString()){
            res.status(403).send({error: "You cannot edit task"});
            return
        }
        if(req.body.user){
            res.status(400).send({error: "User filed must not be in request "});
            return;
        }

        if(req.body.status && !['new', 'in_progress', 'completed'].includes(req.body.status)){
            res.status(400).send({error: "status not found "});
            return;
        }

        const updatedTask = await Task.findByIdAndUpdate(taskById, req.body, {new: true});

        if(!updatedTask){
            res.status(400).send({error: "Filed to update task"});
        }

        res.send({message: 'Task updated', updatedTask});
    }catch(error){
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message,
            }));
            res.status(400).send({ error: validationErrors });
            return
        }
        next(error);
    }
})

export default tasksRouter;