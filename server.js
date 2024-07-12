const express = require("express");
const cors = require("cors");
const mysql = require('mysql');

const app = express();
app.use(express.json());

// const corsOptions = {
//     origin: 'https://task-management-frontend-mocha.vercel.app', 
//     optionsSuccessStatus: 200 
// };
// app.use(cors(corsOptions));
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "task_management" 
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
});

app.get('/', (req, res) => {
    const sql = "SELECT * FROM tasks";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.json({ error: 'Database query error' });
        }
        return res.json(result);
    });
});

app.post('/create', (req, res) => {
    const sql = "INSERT INTO tasks (`title`, `description`, `is_completed`) VALUES (?, ?, ?)";
    const values = [req.body.title, req.body.description, req.body.isCompleted];
    
    db.query(sql, values, (err, result) => {
        if (err) return res.json("error");
        return res.json(result);
    });
});

app.put('/update/:id', (req, res) => {
    const sql = "UPDATE tasks SET `title` = ?, `description` = ?, `is_completed` = ? WHERE id = ?";
    const values = [req.body.title, req.body.description, req.body.isCompleted];
    const id =  req.params.id;
    db.query(sql, [...values, id], (err, result) => {
        if (err) {
            if (err) return res.json("error");
        }
        return res.json(result);
    });
});


app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM tasks WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) {
            if (err) return res.json("error");
        }
        return res.json(result);
    });
});




app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
