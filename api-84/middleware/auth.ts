import { NextFunction, Request, Response } from "express";
import {HydratedDocument} from "mongoose";
import {Users} from "../types";
import User from "../models/User";

export interface RequestWithUser extends Request {
    user?: HydratedDocument<Users>;
}

const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {

    const token = req.get("Authorization");

    if(!token){
        res.status(401).send({error: "No token present"});
        return;
    }

    const user = await User.findOne({token});

    if(!user){
        res.status(401).send({error: "Wrong token"});
        return;
    }

    req.user = user;

    next()
}

export default auth;