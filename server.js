const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, 'books.json');

app.use(cors());
app.use(bodyParser.json());

// 读取书籍数据
function readBooks() {
  if (fs.existsSync(dataFile)) {
    const data = fs.readFileSync(dataFile);
    return JSON.parse(data);
  }
  return {};
}

// 写入书籍数据
function writeBooks(books) {
  fs.writeFileSync(dataFile, JSON.stringify(books, null, 2));
}

app.get('/books/:isbn', (req, res) => {
  const books = readBooks();
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json({ views: books[isbn].views });
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

app.post('/books/:isbn/increment', (req, res) => {
  const books = readBooks();
  const isbn = req.params.isbn;
  if (books[isbn]) {
    books[isbn].views++;
    writeBooks(books);
    res.json({ views: books[isbn].views });
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
