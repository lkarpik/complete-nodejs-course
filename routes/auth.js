const express = require('express');
const {
    check,
    body
} = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .normalizeEmail()
        // .if(body('password').isLength({
        //     min: 3
        // }))
        // .custom((value, {
        //     req
        // }) => {
        //     return User
        //         .findOne({
        //             email: value
        //         })
        //         .then(user => {
        //             if (!user) {
        //                 return Promise.reject('No user found!');
        //             }
        //         });
        // })
        ,
        body('password')
        .isLength({
            min: 3
        })
        .withMessage('Passwrod nedd to be at least 3')
        .trim(),
    ], authController.postLogin);

router.post('/signup',
    [
        // check every input (headers, params, body, cookies etc.)
        check('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .normalizeEmail()
        .custom((value, {
            req
        }) => {
            // if (value === 'forbidden@test.com') {
            //     throw new Error('Forbidden email')
            // }
            // return true;
            return User
                .findOne({
                    email: value
                })
                .then(user => {
                    if (user) {
                        return Promise.reject('Email already exists!');
                        // throw new Error('Email already exists!');
                    }
                });
        }),

        body('password')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage('Passwrod nedd to be at least 3'),

        body('confirmPassword')
        .trim()
        .custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords dont\'t match');
            }
            return true;
        })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;