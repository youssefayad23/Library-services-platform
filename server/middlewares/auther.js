const User = require('../model/User');

const user = new User();

const auth = async (req, res, next) => {
  console.log(req.headers.authorization);
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res.status(403).json({ message: 'access rejected...' });
  }
  const userID = req.headers.userid;
  console.log(userID);
  if (!token) {
    return res.status(403).json({ message: 'you are not a authorization.' });
  } else if (token) {
    const returnedUser = await user.getUserByID(userID);
    console.log(returnedUser);
    if (returnedUser[0].token == token) {
      next();
    } else {
      return res.status(403).json({ message: 'invalid token.' });
    }
  }
};

module.exports = auth;
