// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV !== 'production'){ //dynamic import in case we're on the non-production build
  const env = await import ('dotenv');
  env.config();
}

import {connectDB} from './config/db.config.js'; // Or import mongoose from 'mongoose' if using ES modules
connectDB();

import express from 'express';
import initializePassport from './config/passport-config.js';  //written as .js cause you still need to write that after compilation
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import cors from 'cors';

import {findUserbyUsername, findUserById} from './services/user.service.js';

import registerRoute from './routes/register.js';
import loginRoute from './routes/login.js';
import { UserDocument } from './models/user.model.js';
import { checkAuthenticated } from './middleware/checkAuth.js';

initializePassport(
  passport,
  username => findUserbyUsername(username),
  id => findUserById(id)
);

const app = express();

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET ?? 'to remove the warning',
  resave: false, //this just resaves if nothing has changed, which usually we don't want to do
  saveUninitialized: false,  //saves an empty value in the session, if there is no value, and we don't want to do that 
  cookie: { secure: 'auto', maxAge: 1000*60*60*24 }  //secure: true -> only works for https
   //maxAge should be one day rn. So the session persists even after the browser is closed
}));

app.use(passport.initialize());
app.use(passport.session()) //this makes the variables persist through the entire session the user is having

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173' //you have to make a callback function if you want more than one possible origin
}));

// nga ketu fillojne routes normally

app.use('/register', registerRoute);
app.use('/login', loginRoute(passport));

app.get('/', checkAuthenticated, (req,res)=>{
  const {username, email, role} = req.user as UserDocument;
  res.json({email, username, role}); //we have removed the password in the serialization process, so this should be fine
});

app.delete('/logout', checkAuthenticated, (req, res)=>{
  req.logOut(err => console.log(err));
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

app.listen(3000, ()=> console.log('listening on port: 3000'));