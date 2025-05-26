const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "orbitalusers"
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                console.error("Database error: ", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length === 0 || result === null) {
                return res.status(401).json({ message: "Username or password may be incorrect!" });
            }

            const user = result[0];

            bcrypt.compare(password, user.pass, (err, isMatch) => {
                if (err) {
                    console.error("bcrypt error: ", err);
                    return res.status(500).json({ message: "Auth error" });
                }

                if (isMatch) {
                    return res.status(200).json({ message: "Login successful", user: {username: user.username } });
                } else {
                    return res.status(200).json({ message: "Incorrect password" });
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



app.listen(3001, () => {
    console.log("Listening...");
})