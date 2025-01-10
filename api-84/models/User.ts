import mongoose, {Model} from "mongoose";
import bcrypt from "bcrypt";
import {Users} from "../types";
import {randomUUID} from "node:crypto";

interface UserMethod{
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void
}

type UserModal = Model<Users, {}, UserMethod>

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const userSchema = new Schema<
    Users,
    UserModal,
    UserMethod
>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    token:{
        type: String,
        required: true,
    }
})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
})

userSchema.methods.checkPassword = function (password:string) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function (){
    this.token = randomUUID();
}

userSchema.set("toJSON", {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
})

const User = mongoose.model("User", userSchema)

export default User