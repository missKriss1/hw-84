import express from "express";
import Task from "../models/Task";
import mongoose from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";
import User from "../models/User";

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req:RequestWithUser, res, next) => {
   try{
       if(!req.user || !req.user._id){
           res.status(400).send({error: "Invalid or missing user ID"});
           return;
       }

       const usersById = await User.findById(req.user._id);

       if(!usersById){
           res.status(400).send({error: "User does not exist"});
       }

       const newTask = new Task({
           user: req.user?._id,
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
       }
       next(error);
   }
})

tasksRouter.get('/',auth,  async (req:RequestWithUser, res, next) => {
    try{
        if( !req.user || !req.user._id){
            res.status(400).send({error: "User not authenticated"});
        }

        const task = await Task.find({user: req.user?._id});
        res.send(task);
    }catch (error){
        next(error);
    }
})

export default tasksRouter;