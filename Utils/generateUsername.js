
 function generateUsername(email) {
  const localPart = email.split("@")[0];           // get the part before "@"
  const randomNum = Math.floor(Math.random() * 10000); // random number between 0-9999
  return `${localPart}${randomNum}`;              // concatenate
}

module.exports = generateUsername;