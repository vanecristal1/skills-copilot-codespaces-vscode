//create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const commentsPath = path.join(__dirname, 'comments.json');

//middleware
app.use(express.static('public'));
app.use(bodyParser.json());

//get comments
app.get('/comments', (req, res) => {
    fs.readFile(commentsPath, (err, data) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(JSON.parse(data));
    });
});

//add comments
app.post('/comments', (req, res) => {
    const { name, comment } = req.body;
    if (!name || !comment) {
        res.status(400).json({ error: 'name and comment are required' });
        return;
    }
    fs.readFile(commentsPath, (err, data) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const comments = JSON.parse(data);
        comments.push({ name, comment });
        fs.writeFile(commentsPath, JSON.stringify(comments), (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ status: 'success' });
        });
    });
});

//start server
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});