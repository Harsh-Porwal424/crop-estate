import prisma from "../lib/prisma.js";
import bcrypt from 'bcrypt';

// Fetch all users
export const getUsers = async (req, res) => {
    console.log("Users Fetching Started");
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching users" });
    }
    console.log("Users fetched successfully");
}

// Fetch a single user by ID
export const getUser = async (req, res) => {
    const  id  = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching user" });
    }
}

// Update a user's information
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const {password, avatar,  ...inputs} = req.body;


    if(id != tokenUserId){
        return res.status(403).json({ message: "Unauthorized to update this user" });
    }

    const { name, email } = req.body;
    let updatedPassword = null;
    try {

        if(password){
            updatedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && {password: updatedPassword  }),
                ...(avatar && {avatar})

            },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating user" });
    }
}

// Delete a user by ID
export const deleteUser = async (req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;

    if(id != tokenUserId){
        return res.status(403).json({ message: "Unauthorized to update this user" });
    }

    try {
        await prisma.user.delete({
            where: { id }
        });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting user" });
    }
}