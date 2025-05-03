import { Router, Request, Response, json } from "express";
import { insertUser } from "../services/user.service.js";
import bcrypt from 'bcryptjs';
import { UserDtos } from "../models/userModel.js";
import { checkNotAuthenticated } from "../middleware/checkAuth.js";

// :/register

const route = Router();;
route.use(json());
route.use(checkNotAuthenticated);  //this will probably work before every request, I think

type RegisterPostRequest = Request<{}, {}, UserDtos> //we've written the req.body composition

route.post('/', async (req: RegisterPostRequest, res: Response) => {
  //due to the urlencoded middleware, we can immediately use req.body.<insert name of input here>
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //10 is how many times that hash is hashed from what I understand
    const user = { username: req.body.username, password: hashedPassword, role: req.body.role };
    const success = await insertUser(user);
    if (success) {
      console.log('Successfully added user:', user);
      res.status(201).send({ // 201 Created for successful resource creation
        success: true,
        message: 'User successfully added',
        data: user, // Include the created user data
      });
    }
    else
      res.status(500).send({ // 500 Internal Server Error for database insertion failure
        success: false,
        message: 'User not added successfully',
        error: 'Failed to insert user into database', // More specific error
      });
  } catch (error: any) {
    console.error('Error adding user:', error);
    res.status(500).send({ // 500 Internal Server Error for any error during the process
      success: false,
      message: 'Problem adding user',
      error: error.message || 'An unexpected error occurred', // Include the error message
    });
  }
});

export default route;