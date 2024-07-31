import jwt from 'jsonwebtoken';

export const shouldBeLoggedIn = async (req, res) => {

    console.log(req.userId);

    res.status(200).json({ message: "User is logged in & Authenticated" });

}

export const shouldBeAdmin = async (req, res) => {

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
        if(payload.role!== "admin") {
            return res.status(403).json({ message: "Not an Admin" });
        }
    })

    res.status(200).json({ message: "User is logged in & Authenticated" });

}