import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        // Send a response back to the client
        res.status(201).json({ message: "User registered successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while registering the user" });
    }
};

export const login = async (req, res) => {
    // Implement login logic

    const { username, password } = req.body;
    try{
        //check if the user exists in the database

        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if(!user){
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //check user passworkd is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        //genearte JWT token and send it back to the client
        // res.setHeader("Set-Cookie", "test="+"myValue").json("sucessful login");
        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: age }); 

        const {password:userPassword, ...userInfo} = user;

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
            // secure: true
        }).status(200).json(userInfo);

    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "An error occurred while logging in the user" });
    }

};

export const logout = (req, res) => {
    // Implement logout logic
    res.clearCookie("token").json({ message: "User logged out successfully" });
};