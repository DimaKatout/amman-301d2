'use strict';

const express = require('express');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded());

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.status(200).send('We are alive Class!!!');
});


app.get('/contact', (req,res) => {
    res.sendFile('./index.html', {root: './public'});
});

app.post('/contact', (req,res) => {
    console.log(req.body);
    res.sendFile('./thanks.html', {root: './public'});
});

app.get('*', (req,res) => {
    res.status(404).send('Not Found');
});
app.listen(PORT, ()=> {
    console.log('Working!!!!!!!');
});