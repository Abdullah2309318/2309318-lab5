const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Your routes here

// In-storage Books Arr (start empty per spec)
let books = [];
const studentNumber = "2309318";

// Who am I? -> Student Number
app.get('/whoami', (req, res) => {
    res.json({studentNumber: studentNumber});
})

// All Books
app.get('/books', (req, res) => {
    res.json(books);
})

// Specific Books
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === req.params.id);

    if (book) {
        res.json(book);
    }
    else {
        res.status(404).json({ error: "Book not found" });
    }
});

// Create a book
app.post('/books', (req, res) => {
    const { id, title, details } = req.body;
    if (id === undefined || id === null || id === '' || !title) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const newBook = {
        id: String(id),
        title: String(title),
        details: Array.isArray(details) ? details : []
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

// Update a book
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    if (req.body.title !== undefined) book.title = req.body.title;
    if (req.body.details !== undefined) book.details = req.body.details;
    res.json(book);
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    const index = books.findIndex(b => b.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: "Book not found" });
    }
    books.splice(index, 1);
    res.status(204).send();
});

// Add detail to a book
app.post('/books/:id/details', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    const { id, author, genre, publicationYear } = req.body;
    const newDetail = {
        id: String(id),
        author: author ?? '',
        genre: genre ?? '',
        publicationYear: publicationYear ?? null
    };
    book.details = book.details || [];
    book.details.push(newDetail);
    res.status(201).json(book);
});

// Remove detail from a book
app.delete('/books/:id/details/:detailId', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: "Book or detail not found" });
    }
    const index = (book.details || []).findIndex(d => d.id === req.params.detailId);
    if (index === -1) {
        return res.status(404).json({ error: "Book or detail not found" });
    }
    book.details.splice(index, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});