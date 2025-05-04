import { MyUser } from '../models/user.model.js';
export async function insertUser(user) {
    try {
        const newUser = new MyUser(user);
        const savedUser = await newUser.save();
        console.log(savedUser);
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}
export async function findUserById(id) {
    try {
        const user = await MyUser.findById(id);
        return user ?? null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
export async function findUserbyUsername(username) {
    try {
        const user = await MyUser.findOne({ username });
        return user ?? null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
