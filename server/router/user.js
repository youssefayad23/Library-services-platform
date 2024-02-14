const router = require('express').Router();
const conn = require('../config/connection');
const Book = require('../model/Book');
const User = require('../model/User');
const { v4: uuidv4, v4 } = require('uuid');

const user = new User();
const book = new Book();
router.post('/signup', async function (req, res) {
  const data = req.body;
  const result = await user.getUserByEmail(data.email);
  if (result.length > 0) {
    res.status(405).send('this Email address is already reqistered.');
  } else {
    const token = uuidv4();
    const result = await user.createUser(req, res, token);
    res.status(201).json({ message: 'signup sccessfully' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  //console.log(typeof password);
  const result = await user.userLogin(email, password[0]);
  //console.log(result[0].status);
  if (result.length == 0) {
    res.status(404).json({
      message: 'please check you email or pasword.',
    });
  } else if (result[0].status != 1) {
    res.status(405).json({
      message: 'You cannot login new please wait until your approval.',
    });
  } else {
    res
      .status(200)
      .json({ message: 'login Successfully.', userData: result[0] });
  }
});

router.post('/add-book-request/:id&:ISBN', async function (req, res) {
  const { id, ISBN } = req.params;
  console.log(id, ISBN);
  try {
    const result = await book.checkIfBorrowed(ISBN);
    console.log(result);
    if (result[0].isBorrowed == 1) {
      res
        .status(406)
        .json({ message: 'the book is already Borrowed by another user.' });
    } else {
      await book.getRequestToBorrow(id, ISBN, res);
    }
  } catch (error) {
    throw error;
  }
});

router.get('/get-book/:ISBN', async (req, res) => {
  const { ISBN } = req.params;
  try {
    const result = await book.getBookByISBN(ISBN);
    console.log(result);
    res.status(200).json({ message: 'Get data', data: result });
  } catch (error) {
    res.status(404).json({ message: error.message });
    throw error;
  }
});

router.get('/history/:userID', async function (req, res) {
  const { userID } = req.params;
  console.log(userID);
  try {
    const result = await user.getHistory(userID);
    res.status(200).json({ message: 'user history', data: result });
  } catch (error) {
    res.status(404).json({ message: error.message });
    throw error;
  }
});
router.get('/currentApproval/:userID', async function (req, res) {
  const { userID } = req.params;
  console.log(userID);
  try {
    const result = await user.getAprovalRequests(userID);
    res.status(200).json({ message: 'user history', data: result });
  } catch (error) {
    res.status(404).json({ message: error.message });
    throw error;
  }
});

router.put(
  '/returnBook/:id&:ISBN&:limits&:startDate&:endDate',
  async (req, res) => {
    try {
      let { id, ISBN, limits, startDate, endDate } = req.params;
      //console.log(limits);
      await user.returnBook(id, ISBN, startDate, endDate, res);
      limits = parseInt(limits) + 1;
      console.log(res.statusCode);
      await user.updateUserLimits(id, limits);
      console.log(res.statusCode);
      if (res.statusCode == 200) {
        res.status(200).json({ message: 'returned successfully' });
      } else {
        res.status(404).json({ message: 'error' });
      }
    } catch (error) {
      throw error;
    }
  }
);

module.exports = router;
