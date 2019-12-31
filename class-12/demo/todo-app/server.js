'use strict'

// Environment variables
require('dotenv').config();

// Application Dependencies
const express = require('express');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended: true}));

// Specify a directory for static resources
app.use(express.static('./public'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');


function handleError(error, response){
    response.render('pages/error', {error: error});
}

// Routes 

app.get('/' ,getAllTodos);
app.get('/add', addToDB);
app.post('/add', processAdd);
app.get('/tasks/:task_id', getSpecificTask);

function getSpecificTask(req, res){
    let id = req.params.task_id;
    let SQL = `SELECT * FROM Todos WHERE id=$1`;
    let values = [id];

    client.query(SQL, values)
    .then( data => {
        console.log(data.rows[0]);
        res.render('task', {task: data.rows[0]});
    }).catch(err => handleError(err));
}

function getAllTodos(req, res){
    let SQL = `SELECT * FROM Todos;`; 
    client.query(SQL)
    .then( data => {
        res.render('index', {todos: data.rows});
    }).catch(err => handleError(err));
}

function addToDB(req, res){
    res.render('add');
}

function processAdd(req, res){
    console.log(req.body);
    let {title, description, category, contact, status} = req.body;
    let SQL = "INSERT INTO Todos (title, description, contact, category, status) VALUES ($1, $2, $3, $4, $5);";
    let values = [title, description, contact, category, status];
    client.query(SQL, values)
    .then( () => {
        res.redirect('/');
    }).catch(err => handleError(err));
    
}

app.get('*', (req, res) => res.status(404).send('This route does not exist'));



client.connect()
.then( () => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
})
.catch(err => handleError(err));

