const bcrypt = require('bcryptjs');

var password = "Cheng";

bcrypt.genSalt(13, (err, salt)=>{
  console.log("Salt: " + salt);
  bcrypt.hash(password, salt, (err, hash) =>{
    console.log("Hash: " + hash);
  });
});
