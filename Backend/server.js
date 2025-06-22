require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const app = express();

app.use(express.json());
app.use(cors());

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                console.error("Database error: ", err);
                return res.status(500).json({ success: false, message: "Database error" });
            }

            if (result.length === 0 || !result) {
                return res.status(401).json({ success: false, message: "User not found" });
            }

            const user = result[0];

            bcrypt.compare(password, user.pass, (err, isMatch) => {
                if (err) {
                    console.error("bcrypt error: ", err);
                    return res.status(500).json({ success: false, message: "Password comparison failed" });
                }

                if (isMatch) {
                    return res.status(200).json({
                        success: true,
                        message: "Login successful",
                        user: {id: user.id, username: user.username}
                    });
                } else {
                    return res.status(200).json({ success: false, message: "Incorrect password" });
                }

            })

        }
    );
});

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        db.query(
            "INSERT INTO users (username, pass) VALUES (?, ?)",
            [username, hashedPassword],
            (err, result) => {
                if (err) {
                    console.error("Database error: ", err);
                    return res.status(500).json({ message: "Database error" });
                }

                res.status(201).json({ message: "User successfully registered" });
            }
        );
    } catch (error) {
        console.error("Hashing error: ", error);
        return res.status(500).json({ message: "Hashing error" });
    }
});

// suggest users 
app.get('/suggestedUsers', async (req, res) => {
    const { term } = req.query;
    if (!term) return res.status(400).json({ message: "Search term is required" });
    try {
        const result = await db.query(
            `
            SELECT id, username FROM users
            WHERE username LIKE ?
            ORDER BY username
            LIMIT 10
            `,
            [`%${term}%`]); // wildcard for partial matches
        if (result.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch suggestions" });
    }
})

// follow user
app.post('/follow', async (req, res) => {
    const { userId, followId } = req.body;
    if (!userId || !followId) {
        return res.status(400).json({ message: "Username required" });
    }
    if (userId === followId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }
    try {
        await db.query(
            `
            INSERT INTO user_following (user_id, followed_id)
            VALUES (?, ?)
            `,
            [userId, followId]
        );
        res.status(201).json({ message: "Followed!" });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ error: "Already following this user" });
        } else {
            console.error(err);
            res.status(500).json({ message: "Failed to follow" });
        }
    }
});

// get followers
app.get('/followers/:userID', async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    try {
        const result = await db.query(
            `
            SELECT u.id, u.username
            FROM users u
            JOIN user_following uf ON u.id = uf.followed_id
            WHERE uf.user_id = ?
            `,
            [userId]
        );
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch followers" });
    }
});

// get following
app.get('/following/:userID', async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    try {
        const result = await db.query(
            `
            SELECT u.id, u.username
            FROM users u
            JOIN user_following uf ON u.id = uf.user_id
            WHERE uf.followed_id = $1
            `,
            [userId]
        );
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch following" });
    }
});

app.listen(3001, () => {
    console.log("Listening...");
})