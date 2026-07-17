const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const router = express.Router();

// In-memory user storage (resets on server restart)
const users = [];

// Validation
const reginsterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

// Register a new user account
router.post("/register", async (req, res) => {
    const result = reginsterSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    const { email, password } = result.data;

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: "User already exists." });
    }

    // Hash the password
    const  hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), email, password: hashedPassword };
    users.push(user);

    // Sign a token that proves their user's identity for 7 days
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.status(201).json({ token, user: { id: user.id, email: user.email } });
});

// Log in an existing user 
router.post("/login", async (req, res) => {
    const result = reginsterSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    const { email, password } = result.data;

    const user = users.find((u) => u.email === email);
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare the plain-text password against the stored hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, email: user.email } });
}); 

module.exports = router;