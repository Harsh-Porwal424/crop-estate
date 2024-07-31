import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
    console.log("GET request received, Router is working");
    res.send("Router is working");
});

export default router;