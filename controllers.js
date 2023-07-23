let db = require("./db");

let argon = require("argon2");

let jwt = require("jsonwebtoken");

let registerUser = async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  if (!username) {
    res.status(400).json("email is required");
    return;
  }

  let hash;
  try {
    hash = await argon.hash(password);
  } catch (err) {
    console.log("Failed to has the password");
    res.sendStatus(500);
    return;
  }

  let sql = "insert into users (username, hash) values (?,?)";
  let params = [username, hash];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("Failed", err);
    } else {
      res.sendStatus(204);
    }
  });
};

let loginUser = function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let sql = "select id, hash from users where username = ?";
  let params = [username];

  db.query(sql, params, async function (err, results) {
    let storedHash;

    if (err) {
      console.log("Failed to fetch hash for user", err);
    } else if (results.length > 1) {
      console.log("error", username);
    } else if (results.length == 1) {
      storedHash = results[0].hash;
    }

    try {
      let pass = await argon.verify(storedHash, password);
      if (pass) {
        // res.sendStatus(204);
        let token = {
          id: results[0].id,
          username: username,
        };
        let signedToken = jwt.sign(token, process.env.JWT_SECRET, {
          expiresIn: 86400,
        });

        res.json(signedToken);
      } else {
        res.sendStatus(401);
      }
    } catch (err) {
      console.log("failed to verify hash", err);
      res.sendStatus(401);
      return;
    }
  });
};

let listTimezones = function (req, res) {
  let sql = "select * from timezones";

  db.query(sql, function (err, results) {
    if (err) {
      console.log("failed to retrieve timezones", err);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
};

let listUsers = function (req, res) {
  let sql = "select * from users";

  db.query(sql, function (err, results) {
    if (err) {
      console.log("failed to retrieve list of users", err);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
};

let postPhoto = function (req, res) {
  // Processing of photo data is TBD
  let photo = req.body.photo;
  let text = req.body.text;
  let country = req.body.country;
  let timezone_id = req.body.timezone_id
  let userinfo = req.__userinfo;

  let sql =
    "insert into photo (user_id, timezone_id, photo, text, country, post_day) values (?,?,?,?,?,CURRENT_TIMESTAMP())";
  let params = [userinfo.id, timezone_id,  photo, text, country];

  let sql2 = "UPDATE users SET last_post = CURRENT_TIMESTAMP() WHERE id = ?";
  let params2 = [userinfo.id];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("Unable to post photo", err);
      send.sendStatus(500);
    } else {
      db.query(sql2, params2, function (err, results) {
        if (err) {
          console.log("Unable to update user info", err);
          send.sendStatus(500);
        }
      });
      res.sendStatus(204);
    }
  });
};

let getUserPhoto = function (req, res) {
  let id = req.params.id;
  let sql = "select * from photo where user_id = ?";
  let params = [id];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("failed to retrieve photos of user", err);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
};

let getTimezonePhoto = function (req, res) {
  let id = req.params.id;
  let sql = "select * from photo where timezone_id = ?";
  let params = [id];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("failed to retrieve photos of timezone", err);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
};

let deleteUserPhoto = function (req, res) {
  let id = req.params.id;
  let userinfo = req.__userinfo
  let sql = "delete from photo where id = ? and user_id = ?";
  let params = [id, userinfo.id];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("failed to delete photo", err);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
};

module.exports = {
  deleteUserPhoto,
  getTimezonePhoto,
  getUserPhoto,
  postPhoto,
  listTimezones,
  registerUser,
  loginUser,
  listUsers,
};
