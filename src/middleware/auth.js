const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    // Read the authorization header from the request
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided. "});
    }

    // Extract the token after "Bearer"
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided. "});
    } 

    try {
        // Verify the token and attach user data to the request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token." });
    }
}

module.exports = authenticate;