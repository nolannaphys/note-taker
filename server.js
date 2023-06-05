const express = require('express');
const path = require('path');
const fs = require('fs');

const db = require('./db/db.json');
const { error } = require('console');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), "utf-8", (err, data) => {
    if (err) throw err;
    res.json(data)});
    console.log('GET request recieved');
});

app.post('/api/notes', (req, res) => {
    const randomId = Math.floor(Math.random() * 1000);
    const newNote = {
        id: randomId,
        title: req.body.title,
        text: req.body.text
    };
    db.push(newNote);
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(db), "utf-8", (err, data) => {
        if (err) throw err;
        res.json(data);
    });
});

app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);
    const targetId = req.params.id;
    const filterDb = db.filter(db => {
        console.log(db.id);
        return db.id != targetId;
    });
    console.log(filterDb);
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(filterDb), "utf-8", (err, data) => {
        if (err) throw err;
        res.json(data);
    });
});

app.listen(PORT, () => console.log('app is running'));