const express = require('express');
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', publishedDate: '1988-01-01' },
  { id: 2, title: 'The Catcher in the Rye', author: 'J.D. Salinger', publishedDate: '1951-07-16' },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedDate: '1960-07-11' }
];

// Get all books
app.get('/books', (req, res) => {
  res.send(books);
});

// Get a book by id
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found.');
  res.send(book);
});

// Create a new book
app.post('/books', (req, res) => {
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
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found.');
  book.title = req.body.title;
  book.author = req.body.author;
  book.publishedDate = req.body.publishedDate;
  res.send(book);
});

// Delete a book
app.delete('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found.');
  const index = books.indexOf(book);
  books.splice(index, 1);
  res.send(book);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
