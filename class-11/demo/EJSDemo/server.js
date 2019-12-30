'use strict';

const express = require('express');
const superagent = require('superagent');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;
// app.use(express.urlencoded());

app.set('view engine', 'ejs');

// app.use(express.static('public'));

app.get('/', (req,res) => {
    res.status(200).send('EJS Demo');
});


app.get('/test', (req, res) => {
    res.render('index');
});

let cats = ['Instance', 'Newton', 'Abu Aseel', 'Sherry'];

app.get('/cats', (req, res) => {
    res.render('cats', {'data':cats})
});

app.get('/books', (req, res) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=amman`;
    superagent.get(url)
    .then( data => {
        res.render('books',{'books': data.body.items})
        // res.json(data.body.items);
    });
    // get data from googe
    // .then ( send a res)
    // OR process the data then send a response
});

// app.get('/contact', (req,res) => {
//     res.sendFile('./index.html', {root: './public'});
// });

// app.post('/contact', (req,res) => {
//     console.log(req.body);
//     res.sendFile('./thanks.html', {root: './public'});
// });

app.get('*', (req,res) => {
    res.status(404).send('Not Found');
});
app.listen(PORT, ()=> {
    console.log('Working!!!!!!!');
});