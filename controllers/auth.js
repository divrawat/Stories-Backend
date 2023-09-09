import User from "../models/user.js"
import jwt from "jsonwebtoken"
import _ from "lodash"
import { expressjwt } from "express-jwt"


export const signup = async (req, res) => {
    try {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const {name, email, password } = req.body;

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.json({
            message: 'Signup success! Please signin.'
        });
    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
};




export const signin = async (req, res) => {
    const { password } = req.body;
    try {
      // check if user exists
      const user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(400).json({
          error: "User with that email does not exist. Please signup.",
        });
      }
  
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Email and password do not match.",
        });
      }
  
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });
  
      res.cookie("token", token, { expiresIn: "10d" });
      const { name, email, role } = user;
      return res.json({
        token,
        user: { name, email, role },
      });
    } catch (err) {
      return res.status(500).json({
        error: "Something went wrong.",
      });
    }
  };




export const signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
};


export const requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});



  export const adminMiddleware = async (req, res, next) => {
    try {
        const adminUserId = req.auth._id;
        const user = await User.findById(adminUserId).exec();
        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.role !== 1) {
            return res.status(400).json({
                error: 'Admin resource. Access denied'
            });
        }
        req.profile = user;
        next();
    } catch (err) {
        console.error("Error in adminMiddleware:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};