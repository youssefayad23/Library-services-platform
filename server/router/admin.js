const router = require('express').Router();
const conn = require('../config/connection');
const express = require('express');
const Admin = require('../model/Admin');
const auth = require('../middlewares/auther');
const adminAuth = require('../middlewares/admin');

const admin = new Admin();
router.get('/get-all-users', auth, adminAuth, async function (req, res) {
  const result = await admin.getAllUsers();
  //console.log(result);
  if (result.length == 0) {
    res.status(404).json('there not found any users.');
  } else {
    res.status(200).json(result);
  }
});

router.get('/get-new-users', auth, adminAuth, async (req, res) => {
  const allUsers = await admin.getNewUsers();
  if (allUsers.length == 0) {
    res.status(404).json({
      message: 'ther are no new users waiting for approval.',
    });
  } else {
    //console.log(allUsers[0]);
    res
      .status(200)
      .json({ message: 'get all users successfully.', allData: allUsers });
  }
});

router.put(
  '/get-new-users/:userID&:reqLimit',
  auth,
  adminAuth,
  async (req, res) => {
    const { userID, reqLimit } = req.params;
    await admin.approveUser(userID, reqLimit, res);
    if (res.statusCode == 404) {
      res.json({ message: 'samething Wrong.' });
    } else {
      res.json({ message: 'Approveal completed ' });
    }
  }
);

router.get('/all-borrowed-request', auth, adminAuth, async (req, res) => {
  const allRequest = await admin.getAllBorrowedRequest();
  //console.log(allRequest);
  if (allRequest.length == 0) {
    res
      .status(200)
      .json({ message: 'there not found any requests.', data: allRequest });
  } else {
    res
      .status(200)
      .json({ message: 'there found some requests', data: allRequest });
  }
});
/* router.put('/all-borrowed-requests', auth, adminAuth, async (req, res) => {
  const { id, ISBN, startDate, endDate } = req.body;
  await admin.approveBorrowedRequest(id, ISBN, startDate, endDate, res);
  if (res.status === 500) {
    res.json({ message: 'samething Wrong.' });
  } else {
    await admin.setStatusOfBookRequest(ISBN);
    res.json({ massage: 'Approveal completed ' });
  }
}); */
router.put(
  '/aprove-borrowed-request/:id&:ISBN&:startDate&:endDate',
  auth,
  adminAuth,
  async (req, res) => {
    const { id, ISBN, startDate, endDate } = req.params;
    let userLimits = await admin.getUserLimitsByID(id);
    userLimits = userLimits.limited_requests;
    //console.log(userLimits);
    if (userLimits > 0) {
      await admin.approveBorrowedRequest(id, ISBN, startDate, endDate, res);
      if (res.status === 500) {
        res.json({ message: 'samething Wrong.' });
      } else if (res.status === 405) {
        res.json({ message: 'samething Wrong.' });
      } else {
        userLimits = userLimits - 1;
        await admin.updateUserLimits(id, userLimits);
        await admin.updateDateInHistory(id, ISBN, startDate, endDate);
        await admin.updateStatusInHistory(id, ISBN, 'aproval');
        res.json({ message: 'Approveal completed ' });
      }
    } else {
      res.status(405).json({ message: 'Not Allowed' });
    }
  }
);

router.delete(
  '/reject-borrowed-request/:id&:ISBN',
  auth,
  adminAuth,
  async (req, res) => {
    const { id, ISBN } = req.params;
    const result = await admin.rejectBorrowedRequest(id, ISBN);
    if (result.affectedRows == 1) {
      res.status(202).json({ message: 'delete successfuly', data: result });
      await admin.updateStatusInHistory(id, ISBN, 'rejected');
    } else {
      res.status(400).json({ message: 'bad request' });
    }
  }
);

router.delete('/delete-book/:ISBN', auth, adminAuth, async (req, res) => {
  const { ISBN } = req.params;
  //console.log(ISBN);
  const result = await admin.deleteBookByISBN(ISBN);
  if (result.affectedRows == 1) {
    res.status(202).json({ message: 'delete successfuly', data: result });
  } else {
    res.status(400).json({ message: 'bad request' });
  }
});

router.put(
  '/update-book/:ISBN&:title&:description&:author&:rackNumber&:subject',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const { ISBN, title, description, author, rackNumber, subject } =
        req.params;
      const data = {
        title: title,
        description: description,
        author: author,
        rackNumber: rackNumber,
        subject: subject,
      };
      //console.log(data);
      const result = await admin.updateBook(ISBN, data, res);
      //console.log(result);
      if (result.affectedRows == 1) {
        res.json({ message: 'update successfuly' });
      } else {
        res.json({ message: 'bad request' });
      }
    } catch (error) {
      throw error;
    }
  }
);

router.delete('/reject-user/:id', auth, adminAuth, async (req, res) => {
  const { id } = req.params;
  const result = await admin.rejectUser(id);
  if (result.affectedRows == 1) {
    res.status(202).json({ message: 'delete successfuly' });
  } else {
    res.status(400).json({ message: 'bad request' });
  }
});

module.exports = router;
