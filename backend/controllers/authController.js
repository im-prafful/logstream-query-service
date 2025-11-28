import express from 'express'
import bcrypt from 'bcryptjs'
import query from '../dbConnector.js'
import jwt from 'jsonwebtoken'

export const signupFnc = async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Bad request: Please fill all required fields.' });
    }

    try {
        const userCheck = await query(`SELECT email FROM users WHERE email = '${email}'`);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const hashed_password = await bcrypt.hash(password, 10);


        const dbResult = await query(
            `INSERT INTO users(email, full_name, hashed_password) VALUES('${email}', '${name}', '${hashed_password}')`
        );

        console.log(`[INSERT SUCCESSFUL]`);

        return res.status(201).json({ message: 'User successfully created' });

    } catch (inserterr) {

        console.error('Signup Error:', inserterr);
        return res.status(500).json({ message: 'Internal server error during user insertion.' });
    }
};

export const loginFnc = async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email || !password) {
            res.status(401).json({ message: 'Bad request/Fill all fields' })
            return
        }

        const result = await query(`SELECT hashed_password FROM users where email='${email}'`)

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const flag = await bcrypt.compare(password, result.rows[0].hashed_password)

        if (!flag) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        let userData = await query(`SELECT * FROM users where email='${email}'`)
        const user = userData.rows[0];

        // Build JWT
        const payload = {
            email: user.email
        };

        const token = jwt.sign(
            payload,
            'dfsdfsdfsdf',
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "user successfully fetched",
            data: user,
            token: token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Login failed' });
    }

}