import prisma from "../lib/prisma.js";
import { ObjectId } from "mongodb"; // Import ObjectId from mongodb

export const getPosts = async (req, res) => {
    const query = req.query;
    //console.log("Query:", query);
    try {
        const posts = await prisma.post.findMany(
            {
                where: {
                    city: query.city || undefined,
                    type: query.type || undefined,
                    property: query.property || undefined,
                    bedroom: parseInt(query.bedroom) || undefined,
                    price: {
                      gte: parseInt(query.minPrice) || 0,
                      lte: parseInt(query.maxPrice) || 10000000,
                    },
                  },
            }
        );
        // setTimeout(() => {
            res.status(200).json(posts);
        // }, 1000);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching posts" });
    }
}

export const getPost = async (req, res) => {
    const id = req.params.id;

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    }
                },
            }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching post" });
    }
}

export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;
    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData, 
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,
                },
            },
        });
        res.status(200).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while adding the post" });
    }
}

export const updatePost = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }

    try {
        const updatedPost = await prisma.post.update({
            where: { id },
            data: body,
        });
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the post" });
    }
}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await prisma.post.delete({
            where: { id },
        });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the post" });
    }
}