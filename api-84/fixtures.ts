import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Task from "./models/Task";
import {randomUUID} from "node:crypto";


const run = async () =>{
    await mongoose.connect(config.db);

    const db = mongoose.connection;

    try{
        await  db.dropCollection('users');
        await  db.dropCollection('tasks');
    }catch(err){
        console.log(err);
    }

    const [usernameKris, usernameJane ] = await User.create(
        {
            username: 'kris',
            password: '123',
            token: randomUUID(),
        },{
            username: 'Jane',
            password: '12345',
            token: randomUUID(),
        });
    await Task.create(
        {
            user: usernameKris._id,
            title: 'helli',
            description: 'test',
            status: 'new'
        },
        {
            user: usernameJane._id,
            title: 'hello test 1',
            description: 'test 3',
            status: 'complete'
        },
        {
            user: usernameJane._id,
            title: 'hello test 1',
            description: null,
            status: 'complete'
        })
    await db.close();
}

run().catch(console.error)