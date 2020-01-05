'use strict'

// Environment variables
require('dotenv').config();

// Application Dependencies
const express = require('express');
const pg = require('pg');

const methodOverride = require('method-override');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Application Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// Static Routes
app.use(express.static('public'));

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes
app.get('/', getTasks);
app.get('/tasks/:task_id', getOneTask);
app.get('/add', showForm);
app.post('/add', addTask);
app.put('/update/:task_id', updateTask);
app.delete('/delete/:task_id', deleteTask);



// Failsafe Routes
app.get('*', (req, res) => res.status(404).send('This route does not exist'));
app.get((error, req, res) => handleError(error, res)); // handle errors


// HELPER FUNCTIONS

function getTasks(req, res) {
  let SQL = 'SELECT * from tasks;';

  return client.query(SQL)
    .then(results => res.render('index', { results: results.rows }))
    .catch(handleError);
}

function getOneTask(req, res) {
  let SQL = 'SELECT * FROM tasks WHERE id=$1;';
  let values = [req.params.task_id];

  return client.query(SQL, values)
    .then(result => {
      // console.log('single', result.rows[0]);
      return res.render('pages/detail-view', { task: result.rows[0] });
    })
    .catch(err => handleError(err, res));
}

function showForm(req, res) {
  res.render('pages/add-view');
}

function addTask(req, res) {
  // console.log(req.body);
  let { title, description, category, contact, status } = req.body;

  let SQL = 'INSERT INTO tasks(title, description, category, contact, status) VALUES ($1, $2, $3, $4, $5);';
  let values = [title, description, category, contact, status];

  return client.query(SQL, values)
    .then(res.redirect('/'))
    .catch(err => handleError(err, res));
}


// app.put('/update/:task_id', updateTask);

function updateTask(req, res){
  // console.log(req);
  let { title, description, category, contact, status } = req.body;
  let SQL = 'UPDATE tasks SET title=$1, description=$2, contact=$3, category=$4, status=$5 WHERE id=$6;';
  let values = [title, description, contact, category, status, req.params.task_id];

  client.query(SQL, values)
  .then(res.redirect(`/tasks/${req.params.task_id}` ))
  .catch(err => handleError(err, res));
}


function deleteTask(req, res){
  let SQL  = 'DELETE FROM tasks WHERE id=$1';
  let values = [req.params.task_id];
  client.query(SQL, values)
  .then(res.redirect('/'))
  .catch(err => handleError(err, res));
}


function handleError(error, res) {
  res.render('pages/error-view', { error: 'Uh Oh' });
}

client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
  });