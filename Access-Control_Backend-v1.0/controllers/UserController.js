import mariadb from "mariadb";
import bcrypt, { compare } from "bcrypt";

const pool = mariadb.createPool({
  host: "127.0.0.1",
  database: "ostiumconfigdb",
  user: "root",
  password: "password",
});

const saltRounds = 10;

const createConnection = async () => {
  return await pool.getConnection();
};

export const checkPassword = async (req, res) => {
  bcrypt.hash("access2023", saltRounds, async (err, hash) => {
    res.send(hash);
  });
};

export const loginUser = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const user = await conn.query(`SELECT * FROM users WHERE username = ?`, [
      req.body.username,
    ]);

    if (user.length > 0) {
      bcrypt.compare(req.body.password, user[0].password, async (err, resp) => {
        if (err) res.send(err);
        if (resp) {
          req.session.user = { loggedIn: true };

          res.send(req.session.user);
        } else {
          res.send("incorrectPassword");
        }
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const logOutUser = async (req, res) => {
  req.session.user = { loggedIn: false };
  res.send(req.session.user);
};

export const isUserLoggedIn = async (req, res) => {
  if (req.session.user) res.send(req.session.user);
  else res.send({ loggedIn: false });
};
