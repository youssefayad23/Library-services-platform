import Login from '../src/shared/Pages/Login.js';
import Signup from '../src/shared/Pages/Signup.js';
import NotFound from "../src/shared/Pages/NotFound.js";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Books from '../src/components/Pages/UserPages/Books.js';
import Borrowed from './components/Pages/UserPages/RequestBorrow.js';
import BorrowedHistory from '../src/components/Pages/UserPages/BorrowedHistory.js';
import AddBook from './components/Pages/AdminPages/AddBook.js';
import ManageBooks from './components/Pages/AdminPages/ManageBooks.js';
import AcceptUser from './components/Pages/AdminPages/AcceptUser.js';
import ManageBorrowedReq from './components/Pages/AdminPages/ManageBorrowReq.js';
import UpdateBook from './components/Pages/AdminPages/UpdateBook.js';
import CurrentBorrowed from './components/Pages/UserPages/CurrentBorrowed.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/books" element={<Books />}></Route>
        <Route path="/borrow/request/" element={<Borrowed />}></Route>
        <Route path="/borrowed/history" element={<BorrowedHistory />}></Route>
        <Route path="/admin/book/add" element={<AddBook />}></Route>
        <Route path="/admin/book/manage" element={<ManageBooks />}></Route>
        <Route path="/admin/users/accept" element={<AcceptUser />}></Route>
        <Route path="/borrowed/current" element={<CurrentBorrowed />}></Route>
        <Route
          path="/admin/borrowed/request"
          element={<ManageBorrowedReq />}
        ></Route>
        <Route path="/admin/book/update/:ISBN" element={<UpdateBook />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
