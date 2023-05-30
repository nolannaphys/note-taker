const express = require('express');
const path = require('path');
const fs = require('fs');

const db = require('./db/db.json') ;
const { error } = require('console');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(db);
    console.log('GET request recieved');
});

app.post('/api/notes', (req, res) => {
    const newNote = {
        id: db.length - 1,
        title: req.body.title,
        text: req.body.text
    };
    db.push(newNote);
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(db), (err) => {
        if(err) throw err;
        res.json(db);
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const targetId = req.params.id;
    const filterDb = db.filter(db => db.id !== targetId);
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(filterDb), (err) => {
        if(err) throw err;
        res.json(filterDb);
    });
});