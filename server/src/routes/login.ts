import { Router, Request, Response, json } from "express";
import { PassportStatic } from "passport";
import { checkNotAuthenticated } from "../middleware/checkAuth.js";

// :/login
export default function loginRoute(passport: PassportStatic) {
  const route = Router();
  route.use(json());

  // Route to check if user is already logged in
  route.get('/', async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const { username, email, role, name, avatar, _id } = req.user as Express.User;
      res.json({ 
        success: true,
        message: 'User is authenticated',
        user: { username, email, role, name, avatar, _id }
      });
    } else {
      res.json({ 
        success: false, 
        message: 'User is not authenticated' 
      });
    }
  });

  // Handle login attempts
  route.post('/', checkNotAuthenticated, (req, res, next) => {
    console.log("Login attempt for user:", req.body.username);
    res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
    return next();
  }, passport.authenticate('local', { 
    failureMessage: true,
    failureRedirect: '/login/failed'
  }), (req: Request, res: Response) => {
    const { username, email, role, name, avatar, _id } = req.user as Express.User;
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { username, email, role, name, avatar, _id }
    });
  });

  // Handle failed login attempts
  route.get('/failed', (req: Request, res: Response) => {
    res.status(401).json({
      success: false,
      message: 'Login unsuccessful',
      error: 'Invalid credentials'
    });
  });

  return route;
}