import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Implement authentication middleware to check if the user is logged in
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({ message: "Not Authenticated" });
    }

    // Verify the token using the JWT library
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if(err) {
            return res.status(403).json({ message: "Token Not Valid" });
        }
        req.userId = payload.id;
        next();
    });

}