const router = require('express').Router();
const { log } = require('console');
const conn = require('../config/connection');
const adminAuth = require('../middlewares/admin');
const auther = require('../middlewares/auther');
const Book = require('../model/Book');
const multer = require('multer');
const path = require('path');
const { fileURLToPath } = require('url');
//const dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadPath = path.join(
  __dirname,
  '..',
  '..',
  'client',
  'public',
  'uploads',
  '/'
);
console.log(uploadPath);
const book = new Book();
//img storage confing
let imgConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});
//img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(null, Error('only image is allowed'));
  }
};

let upload = multer({
  storage: imgConfig,
  fileFilter: isImage,
});

router.get('/', async function (req, res) {
  const books = await book.getAllBooks();
  //console.log(books);
  if (books.length == 0) {
    res.status(404).json({ message: 'Not found any books!' });
  } else {
    res
      .status(201)
      .json({ message: 'Get all books successfully.', data: books });
  }
});
router.get('/available-Books', async function (req, res) {
  const books = await book.getAvailableBooks();
  //console.log(books);
  if (books.length == 0) {
    res.status(404).json({ message: 'Not found any books!' });
  } else {
    res
      .status(201)
      .json({ message: 'Get all books successfully.', data: books });
  }
});

router.post('/add-new-book', upload.single('photo'), async function (req, res) {
  //console.log(req.body.description);
  try {
    const bookData = req.body;
    let imgName = req.file;
    //console.log(imgName);
    //console.log(req.file);
    const filePath = '/uploads/' + imgName.filename;
    await book.addNewBook(bookData, filePath, res);
  } catch (error) {
    res.status(204).json({ message: error.message });
    throw error;
  }
});

router.get('/book-by-ISBN/:ISBN', async (req, res) => {
  try {
    const { ISBN } = req.params;
    //console.log(ISBN);
    const bookData = await book.getBookByISBN(ISBN);
    //console.log(bookData);
    if (bookData.length > 0) {
      res.status(200).json({ message: 'found', data: bookData });
    } else {
      res.status(404).json({ message: 'book is not found.' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
