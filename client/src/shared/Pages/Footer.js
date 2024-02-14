import "../style/Footer.css";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <h3 className="font-italic font-weight-bold">LIBRARY</h3>
        <p>
          A library is a collection of materials, books or media that are
          accessible for use and not just for display purposes. A library
          provides physical hard copies materials, and have a physical location.
        </p>
      </div>
      <div className="footer-bottom">
        <div className="footer-menu">
          <ul className="f-menu">
            <li>
              <Link to="/books">Books</Link>
            </li>
            <li>
              <Link to="/borrowed/current">Current Borrow</Link>
            </li>
            <li>
              <Link to="/borrowed/history">Borrowed History</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
