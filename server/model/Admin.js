const router = require('express').Router();
const conn = require('../config/connection');
const Book = require('./Book');

class Admin {
  getAllUsers = () => {
    try {
      const result = conn.awaitQuery('select * from users');
      return result;
    } catch (error) {
      throw error;
    }
  };

  async getNewUsers() {
    try {
      const result = await conn.awaitQuery('select * from users where ?', {
        status: 0,
      });
      //console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getNewUserByID(id) {
    try {
      const result = await conn.awaitQuery(
        'select * from users where ? and ? ',
        [{ id: id }, { status: 0 }]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async approveUser(id, limit, res) {
    try {
      const exist = await conn.awaitQuery('update users set ? where ?', [
        { status: 1, limited_requests: limit },
        { id: id },
      ]);
      console.log(exist);
      if (exist.affectedRows == 1) {
        res.status(200);
      } else {
        res.status(404);
      }
    } catch (error) {
      throw error;
    }
  }
  async rejectUser(id) {
    try {
      const deleteUser = await conn.awaitQuery('Delete from users where ?', {
        id: id,
      });
      return deleteUser;
    } catch (error) {
      throw error;
    }
  }
  async getUserLimitsByID(id) {
    try {
      const result = await conn.awaitQuery(
        'select limited_requests from users where ? ',
        {
          id: id,
        }
      );
      return result[0];
    } catch (error) {
      throw error;
    }
  }
  async updateUserLimits(id, limit) {
    try {
      const result = await conn.awaitQuery('update users set ? where ? ', [
        { limited_requests: limit },
        {
          id: id,
        },
      ]);
      return result[0];
    } catch (error) {
      throw error;
    }
  }
  async approveBorrowedRequest(id, ISBN, startDate, endDate, res) {
    try {
      const status = await conn.awaitQuery(
        'select isBorrowed from books where ?',
        { ISBN: ISBN }
      );
      /*       console.log(status[0].isBorrowed); */
      if (!status[0].isBorrowed) {
        await conn.awaitQuery('update books set ? where ?', [
          { isBorrowed: 1 },
          { ISBN: ISBN },
        ]);
        await conn.awaitQuery(
          'update borrowed set ? where ? and ?',
          [
            { startDate: startDate, endDate: endDate, is_Borrowed: 1 },
            { user_id: id },
            { book_ISBN: ISBN },
          ],
          (err) => {
            if (err) {
              return res.status(500);
            } else {
              return res.status(200);
            }
          }
        );
      } else {
        res.status(405);
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteBookByISBN(ISBN) {
    try {
      const deletedBook = await conn.awaitQuery('Delete from books where ?', {
        ISBN: ISBN,
      });
      //console.log(deletedBook);
      return deletedBook;
    } catch (error) {
      throw error;
    }
  }
  async updateBook(ISBN, book, res) {
    //console.log(book);
    const updatedBook = await conn.awaitQuery(
      'update books set ? where ?',
      [
        {
          title: book.title,
          author: book.author,
          subject: book.subject,
          rackNumber: book.rackNumber,
          description: book.description,
        },
        {
          ISBN: ISBN,
        },
      ],
      (err) => {
        if (err) {
          res.status(204);
        } else {
          res.status(200);
        }
      }
    );
    return updatedBook;
  }
  async getAllBorrowedRequest() {
    const result = await conn.awaitQuery(
      'select * from borrowed join books on books.ISBN = borrowed.book_ISBN join users on borrowed.user_id = users.id where books.isBorrowed = 0'
    );
    return result;
  }
  async rejectBorrowedRequest(id, ISBN) {
    try {
      const deleteRequest = await conn.awaitQuery(
        'Delete from borrowed where ? and ?',
        [
          {
            user_id: id,
          },
          { book_ISBN: ISBN },
        ]
      );
      return deleteRequest;
    } catch (error) {
      throw error;
    }
  }
  async updateStatusInHistory(id, ISBN, status) {
    await conn.awaitQuery('update history set ? where ? and ? and ?', [
      { status: status },
      { user_id: id },
      { book_ISBN: ISBN },
      { status: 'pending' },
    ]);
  }
  async updateDateInHistory(id, ISBN, startDate, endDate) {
    await conn.awaitQuery('update history set ? where ? and ? and ?', [
      { book_startDate: startDate, book_endDate: endDate },
      { user_id: id },
      { book_ISBN: ISBN },
      { status: 'pending' },
    ]);
  }
}
module.exports = Admin;
