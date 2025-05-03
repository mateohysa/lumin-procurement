import { Router, Request, Response, json } from "express";
import { insertUser } from "../services/user.service";
import bcrypt from 'bcryptjs';
import { UserDtos} from "../models/userModel";
import { checkNotAuthenticated } from "../middleware/checkAuth";

// :/register

const route = Router();;
route.use(json());
route.use(checkNotAuthenticated);  //this will probably work before every request, I think

type RegisterPostRequest = Request<{}, {}, UserDtos> //we've written the req.body composition

route.post('/', async (req: RegisterPostRequest, res: Response) => {
  //due to the urlencoded middleware, we can immediately use req.body.<insert name of input here>
  try {
    // Validate that email is provided
    if (!req.body.email) {
      return res.status(400).send({
        success: false,
        message: 'Email is required',
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10); //10 is how many times that hash is hashed from what I understand
    
    // Use email for username if username is not provided
    const username = req.body.email;
    
    const user = { 
      username: username, 
      email: req.body.email,
      password: hashedPassword, 
      role: req.body.role,
      name: req.body.name
    };
    
    const success = await insertUser(user);
    if (success) {
      console.log('Successfully added user:', user);
      res.status(201).send({ // 201 Created for successful resource creation
        success: true,
        message: 'User successfully added',
        data: {
          username: user.username,
          email: user.email,
          role: user.role,
          name: user.name
        }, // Include the created user data (excluding password)
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