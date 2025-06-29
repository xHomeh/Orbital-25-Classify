require('dotenv').config();
console.log("DB Host:", process.env.DB_HOST);

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: 'metro.proxy.rlwy.net',
    user: 'root',
    password: 'QfLwrbBoWQKgVyLxdSvwcrVkAOffYdza',
    database: 'railway',
    port: 23893
});

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to MySQL:", err.message);
    process.exit(1); // ← this will stop the app if DB is unreachable
  } else {
    console.log("Connected to MySQL database.");
  }
});

const app = express();

app.use(express.json());
app.use(cors());

/*
for login page
*/

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

/*
for signup page
*/

app.post("/signup", async (req, res) => {
    const { username, password, faculty, enrolled_course, year_of_study, display_picture_link } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `
            INSERT INTO users 
                (username, pass, faculty, enrolled_course, year_of_study, display_picture_link)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
            query,
            [username, hashedPassword, faculty, enrolled_course, year_of_study, display_picture_link],
            (err, result) => {
                if (err) {
                    console.error("Database error: ", err);
                    return res.status(500).json({ message: "Database error" });
                }
                res.status(201).json({ success: true, message: "User successfully registered" });
            }
        );
    } catch (error) {
        console.error("Hashing error: ", error);
        return res.status(500).json({ message: "Hashing error" });
    }
});


/*
for friends pages
*/

// suggest users 
app.get('/suggestedUsers', (req, res) => {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ message: "Search term is required" });
    }
    db.query(
        `
        SELECT username, id
        FROM users 
        WHERE username LIKE ? 
        ORDER BY username 
        LIMIT 10
        `,
        [`%${term}%`], 
        (err, results) => {
            if (err) {
                console.error("Error fetching suggestions:", err);
                return res.status(500).json({ message: "Failed to fetch suggestions" });
            }
            if (!results || results.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }
            res.status(200).json(results);
      }
    );
  });

// follow user
app.post('/follow', (req, res) => {
    const { userId, followId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "userId is required." });
    }
    if (!followId) {
        return res.status(400).json({ message: "followId is required." });
    }
    db.query(
        `
        INSERT INTO user_following (user_id, followed_id)
        VALUES (?, ?)
        `,
        [userId, followId],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {  // MySQL duplicate entry error
                    return res.status(400).json({ error: "Already following this user" });
                } else {
                    console.error("Follow error:", err);
                    return res.status(500).json({ message: "Failed to follow" });
                }
            }
            res.status(201).json({ message: "Followed!" });
      }
    );
  });

// get followers
app.get('/followers/:userID', (req, res) => {
    const { userID } = req.params;
  
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    db.query(
        `
        SELECT u.id, u.username
        FROM user_following uf
        JOIN users u ON uf.user_id = u.id
        WHERE uf.followed_id = ?
        `,
        [userID],
        (err, results) => {
            if (err) {
                console.error("Error fetching followers:", err);
                return res.status(500).json({ message: "Failed to fetch followers" });
            }
            res.status(200).json(results);
        }
    );
  });
  

// get following
app.get('/following/:userID', (req, res) => {
    const { userID } = req.params;
  
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    db.query(
        `
        SELECT u.id, u.username
        FROM user_following uf
        JOIN users u ON u.id = uf.followed_id
        WHERE uf.user_id = ?
        `,
        [userID],
        (err, results) => {
            if (err) {
                console.error("Error fetching following:", err);
                return res.status(500).json({ message: "Failed to fetch following" });
            }
            res.status(200).json(results);
        }
    );
  });

// get friends
app.get('/friends/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT u.id, u.username
        FROM users u
        INNER JOIN user_following f1 ON f1.followed_id = u.id AND f1.user_id = ?
        INNER JOIN user_following f2 ON f2.user_id = u.id AND f2.followed_id = ?
    `;

    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error("Error fetching friends:", err);
            return res.status(500).json({ message: "Failed to fetch friends" });
        }
        res.json(results);
    });
});
  
/*
for home page
*/

app.listen(3001, () => {
    console.log("Listening...");
})