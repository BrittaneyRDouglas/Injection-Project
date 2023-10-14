const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT title FROM user WHERE username = '${username}' AND password = '${password}'`;

    console.log('Username:', username);
    console.log('Password:', password);
    console.log('SQL Query:', query);

    db.get(query, (err, row) => {
        if (err) {
            console.log('ERROR', err);
            res.redirect('/index.html#error');
        } else if (!row) {
            res.redirect('/index.html#unauthorized');
        } else {
            res.send(`Hello <b>${row.title}!</b><br />This file contains all your secret data:<br /><br />SECRETS<br /><br />MORE SECRETS<br /><br /><a href="/index.html">Go back to login</a>`);
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = http.createServer(app);
const port = 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

