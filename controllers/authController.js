const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users = [];

exports.register = async (req, res) => {

  const { name, email, password } = req.body;

  const hashedPassword =
    await bcrypt.hash(password, 10);

  users.push({
    name,
    email,
    password: hashedPassword
  });

  res.json({
    message: "User Registered"
  });
};

exports.login = async (req, res) => {

  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email
  );

  if (!user)
    return res.status(400).json({
      message: "User not found"
    });

  const match =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!match)
    return res.status(400).json({
      message: "Wrong password"
    });

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};