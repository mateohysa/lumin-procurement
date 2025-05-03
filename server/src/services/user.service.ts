import { UserDtos, UserDocument, MyUser } from '../models/user.model.js'; // Adjust the path as needed

export async function insertUser(user: UserDtos): Promise<boolean> {
  try {
    const newUser = new MyUser(user);
    const savedUser = await newUser.save();
    console.log(savedUser);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function findUserById(id: string): Promise<UserDocument | null> {
  try {
    const user = await MyUser.findById(id) as UserDocument; // Mongoose uses _id by default
    return user ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function findUserbyUsername(username: string): Promise<UserDocument | null> {
  try {
    const user = await MyUser.findOne({ username }) as UserDocument; // Use findOne with a query object
    return user ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}