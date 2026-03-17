const jwt = require("jsonwebtoken");


const generateToken = (business) => {
  return jwt.sign({ id: business._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;