const conn = require("../config/connection");

class Book {
  async getAllBooks() {
    try {
      const books = await conn.awaitQuery("select * from books");
      return books;
    } catch (error) {
      throw error;
    }
  }
  async getAvailableBooks() {
    try {
      const books = await conn.awaitQuery(
        "select * from books where isBorrowed = 0"
      );
      return books;
    } catch (error) {
      throw error;
    }
  }
  addNewBook = (data, imgName, res) => {
    imgName = imgName.replaceAll("\\", "/");
    try {
      conn.query("insert into books set ?", {
        ISBN: data.ISBN,
        title: data.title,
        author: data.author,
        subject: data.subject,
        rackNumber: data.rackNumber,
        description: data.description,
        img_url: imgName,
      });
      res.json({ status: 201, messege: "created succsessfully" });
    } catch (error) {
      res.status(204).json({ messege: "failed to save the book" });
      throw error;
    }
  };

  async getBorrowedBook(bookISBN) {
    try {
      const result = await conn.awaitQuery("select * from books where ?", {
        ISBN: bookISBN,
      });
      return result[0];
    } catch (error) {
      throw error;
    }
  }
  async checkIfBorrowed(bookISBN) {
    try {
      const result = await conn.awaitQuery("select * from books where ?", {
        ISBN: bookISBN,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getBookByISBN(ISBN) {
    try {
      const result = await conn.awaitQuery("select * from books where ?", {
        ISBN: ISBN,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async handelBorrowedTable(userID, bookISBN) {
    try {
      const result = await conn.awaitQuery(
        "select * from borrowed where ? and ?",
        [{ user_id: userID }, { book_ISBN: bookISBN }]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAllDetailsOfBook(bookISBN) {
    try {
      const result = await conn.awaitQuery("select * from books where ?", {
        ISBN: bookISBN,
      });
      return result[0];
    } catch (error) {
      throw error;
    }
  }
  async setRequstToHistory(userID, bookISBN, book) {
    try {
      await conn.awaitQuery("insert into history set ?", {
        user_id: userID,
        book_ISBN: bookISBN,
        book_title: book.title,
        book_author: book.author,
        book_subject: book.subject,
        book_img_url: book.img_url,
      });
    } catch (error) {
      throw error;
    }
  }
  async getRequestToBorrow(userID, bookISBN, res) {
    try {
      const book = await this.getAllDetailsOfBook(bookISBN);
      //console.log(bookTitle);
      const exist = await this.handelBorrowedTable(userID, bookISBN);
      //console.log(Object.keys(exist).length);
      if (Object.keys(exist).length == 0) {
        await conn.awaitQuery("insert into borrowed set ?", {
          user_id: userID,
          book_ISBN: bookISBN,
        });
        await this.setRequstToHistory(userID, bookISBN, book);
        res.status(200).json({ message: "Request send." });
      } else {
        res
          .status(401)
          .json({ message: "you are already send this request.", data: exist });
      }
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Book;
