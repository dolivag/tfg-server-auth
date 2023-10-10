import express from 'express';
import { body, validationResult } from 'express-validator';
import { handleMethodNotAllowed } from './utils/index.js';
import firebase from '../config/firebase-config.js';
import { UserRepository } from '../repository/UserRepository.js';

export const SIGNUP_ROUTE = '/api/register';
const router = express.Router();

router.post(SIGNUP_ROUTE,
    [
        body('email').isEmail().withMessage('Email must be valid').normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 8, max: 32 })
            .withMessage('Password must be between 8 and 32 characters')
            .escape(),
        body('password')
            .matches(/^(?=.*[a-z])/)
            .withMessage('Password must have at least one lowercase letter'),
        body('password')
            .matches(/^(?=.*[A-Z])/)
            .withMessage('Password must have at least one uppercase letter'),
        body('password')
            .matches(/^(?=.*[0-9])/)
            .withMessage('Password must have at least one number'),
        body('name')
            .trim()
            .isLength({ min: 4, max: 32 })
            .withMessage('Name must be between 4 and 32 characters')
            .escape(),
        body('houseId')
            .trim()
            .isLength({ min: 24, max: 24 })
            .withMessage('House ID must be provided')
    ],
    async (req, res) => {
        console.log("Got request!");
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(400).send({
                errors: errors.array()
            });
        }

        console.log("No errors!");
        const userRepository = new UserRepository(firebase.db);
        const user = await userRepository.findByEmail(req.body.email);
        console.log(user);

        if (!user) {
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                houseId: req.body.houseId,
                password: req.body.password
            };
            userRepository.create(newUser);
        } else {
            return res.status(400).send({
                errors: [{
                    msg: 'Email already in use'
                }]
            });
        }
        return res.status(200).send(newUser);
    }
);

router.options(SIGNUP_ROUTE, async (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With'
    );
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).send();
});

router.get(SIGNUP_ROUTE, handleMethodNotAllowed);
router.put(SIGNUP_ROUTE, handleMethodNotAllowed);
router.delete(SIGNUP_ROUTE, handleMethodNotAllowed);
router.patch(SIGNUP_ROUTE, handleMethodNotAllowed);

export default router;
