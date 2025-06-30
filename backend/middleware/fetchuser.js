const jwt = require("jsonwebtoken");
const JWT_SECRET = "mynameisHimanshu@Boss";

const fetchuser = (req, res, next) => {
    //get the user from the jwt token and add id to req object
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user; // Attach the user data to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
        return;
    }
}


module.exports = fetchuser;