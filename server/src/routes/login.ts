import { Router, Request, Response, json } from "express";
import { PassportStatic } from "passport"; //We actually need to use passport from the index.ts, so I'm not sure if this is gonna work
import { checkNotAuthenticated } from "../middleware/checkAuth.js";

// :/login
export default function loginRoute(passport: PassportStatic) {
  const route = Router();
  route.use(json());
  route.use(checkNotAuthenticated);

  route.get('/', async (req: Request, res: Response) => {
    res.json(req.user ?? { message: 'is not defined, srry' });    //we won't need to pass any extra info to this
  });

  route.post('/', (req, res, next) => {
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
    return next();
  }, passport.authenticate('local'), (req: Request, res: Response) => {
    if (req.user)
      res.status(200).send({
        success: true,
        message: 'Login successful',
        data: req.user, // Include the user data
      });
    else
      res.status(401).send({ // Use 401 Unauthorized for login failure
        success: false,
        message: 'Login unsuccessful',
        error: 'Invalid credentials', // Add an error field
      });
  });
  return route;
}