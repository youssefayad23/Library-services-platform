const User = require('../model/User');

const user = new User();
const adminAuth = async (req, res, next) => {
  const userID = req.headers.userid;
  const returnedUser = await user.getUserByID(userID);
  //const { admin } = req.headers;
  //console.log(returnedUser[0].type);
  if (returnedUser[0].type) next();
  else {
    res.statusCode = 403;
    res.json({ massage: 'You are not Admin.' });
  }
};
module.exports = adminAuth;
