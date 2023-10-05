const express = require('express');
const app = express();
app.use(express.json());

const jwt = require('jsonwebtoken');
const config = require('./config');

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized');
    const decoded = jwt.verify(token, config.secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
}

let books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', publishedDate: '1988-01-01'},
  { id: 2, title: 'The Catcher in the Rye', author: 'J.D. Salinger', publishedDate: '1951-07-16'},
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedDate: '1960-07-11'}
];


// Get all books
app.get('/books', verifyToken, (req, res) => {
  res.send(books);
});

// Get a book by id
app.get('/books/:id', verifyToken, (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found.');
  res.send(book);
});

// Create a new book
app.post('/books', verifyToken, (req, res) => {
  const book = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    publishedDate: req.body.publishedDate
  };
  books.push(book);
  res.send(book);
});

// Update an existing book
app.put('/books/:id', verifyToken, (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found.');
  book.title = req.body.title;
  book.author = req.body.author;
  book.publishedDate = req.body.publishedDate;
  res.send(book);
});

// Delete a book
app.delete('/books/:id', verifyToken, (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found.');
  const index = books.indexOf(book);
  books.splice(index, 1);
  res.send(book);
});

app.post('/login', (req, res) => {
  const user = req.body.username;
  if (!user) return res.status(404).send('User not found');
  const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: config.expiresIn });
  res.send({ token });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
