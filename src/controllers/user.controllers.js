import Controllers from "./class.controller.js";
import UserService from "../services/user.services.js";
import { createResponse } from "../utils.js";
const userService = new UserService();

import { generateToken } from "../middlewares/authJwt.js";

import factory from "../daos/factory.js";
const { userDao } = factory;

export default class UserController extends Controllers {
  constructor() {
    super(userService);
  }

  register = async (req, res, next) => {
      try{
        // res.redirect('/api/users/login');
        const newUser = await userService.register(req.body);
        console.log('----> 2 REGISTER newUser=' + newUser);
        if(!newUser) createResponse(res, 404, 'User already exists');
        else createResponse(res, 200, newUser);
    }catch(error){
        res.redirect('/api/users/error-register');
    }
  };

  login = async (req, res, next) => {
      try{
        const { email, password } = req.body;
        const user = await userService.login(email, password);
        if(!user){
          res.json({msg: 'invalid credentials'});
         } else {
             const access_token = generateToken(user)
             res
                  .cookie('token', access_token, { httpOnly: true })
                  // .header('Authorization', access_token)
                  .json({msg: 'Login OK', access_token});
              console.log('----> 2 login CONTROLLER' + access_token);
         }
    }catch(error){
        res.redirect('/api/users/error-login');
    }
  };

  profile = (req, res, next) => {
    try {
      const { first_name, last_name, email, role } = req.user;
      createResponse(res, 200, {
        first_name,
        last_name,
        email,
        role,
      });
    } catch (error) {
      next(error.message);
    }
  };

  privateCookies = async(req, res) => {
    try {
      const { userId } = req.user;
      const user = await userService.getById(userId);
      console.log('user Controller' + user)
      if (!user) res.send("Not found");
      else {
        const { first_name, last_name, email, role } = user;
        res.json({
          status: "success",
          userData: {
            first_name,
            last_name,
            email,
            role,
          },
        });
      }
    } catch (error) {
      next(error.message);
    }
  }


  githubResponse = async(req, res, next)=>{
    try {
        res.redirect('/api/users/profile');
    } catch (error) {
        res.redirect('/api/users/error-login');
    }
}

 currentUser = async(req, res, next)=>{
    try{
        console.log(req.user);
        res.redirect('/api/users/current');
    }catch(error){
        res.redirect('/api/users/profile');
    }
}
}


