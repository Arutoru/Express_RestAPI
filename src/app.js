const express = require('express');
const app = express();
app.use(express.json());
const bodyParser = require('body-parser'); 

const jwt = require('jsonwebtoken');
const config = require('./config');

const Book = require('./models/Book')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/App', { useNewUrlParser: true, connectTimeoutMS: 3000000 // Increase timeout limit to 300 seconds
});

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
  { title: 'The Alchemist', author: 'Paulo Coelho', publishedDate: '1988-01-01'},
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', publishedDate: '1951-07-16'},
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedDate: '1960-07-11'}
];

const db = mongoose.connection;
db.on('error', (error) => {

  console.error(error);
});

books.forEach((book) => {
  try {

    Book.create(book);
    console.log(`Book ${book.title} created`);
  } catch (error) {
    console.error(error);
  }
});

// Use body-parser middleware to parse incoming requests
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());

// Get all books
app.get('/books', verifyToken, async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a book by id
app.get('/books/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a new book
app.post('/books', verifyToken, async (req, res) => {
  try {
    const book = Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

// Update an existing book by ID
app.put('/books/:id', verifyToken, async (req, res) => {
  const {id, title, author,publishedDate} = req.body;
  const book = await Book.findByIdAndUpdate(req.params.id, {
    id,
    title,
    author,
    publishedDate,
  }, { new: true });
  if (!book) return res.status(404).send('Book not found');
  res.send(book);
});

// Delete an existing book by ID
app.delete('/api/books/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/login', (req, res) => {
  const user = req.body.username;
  if (!user) return res.status(404).send('User not found');
  const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: config.expiresIn });
  res.send({ token });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
