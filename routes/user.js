import express from "express";
const router = express.Router();
import { signin, signout, signup } from "../controllers/auth.js"
import { runvalidation } from "../validators/index.js"
import { check } from "express-validator";

const usersignupvalidator = [
    check('name').isLength({ min: 5 }).withMessage('Name of more than 5 characters is required '),
    check('email').isEmail().withMessage('Must be a valid email address'),
    check("password", "The password must contain at least 1 lowercase, 1 uppercase, 1 numeric,1 special character (!@#$%^&*]) and must be 8 characters or longer.").matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
]

const usersigninvalidator = [ check('email').isEmail().withMessage('Must be a valid email address') ]


router.post('/signup', usersignupvalidator, runvalidation, signup);
router.post('/signin', usersigninvalidator, runvalidation, signin);
router.get('/signout', signout);


export default router;