const express = require("express");
const router = express.Router();
const { User, BlogPost, Comment } = require("../../models");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET user by ID
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user by primary key (ID), including associated blog posts and comments
    const user = await User.findByPk(userId, {
      include: [
        {
          model: BlogPost, 
          include: [
            {
              model: Comment, 
            },
          ],
        },
      ],
    });

    // If user is not found, return a 404 response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data with associated blog posts and comments
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST create new user
router.post("/", async (req, res) => {
  const userData = req.body;

  try {
    const newUser = await User.create(userData);

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      res
        .status(200)
        .json({ user: newUser, message: "You are now logged in!" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST User Login
router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// USER Logout
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// PUT update user by ID
router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user properties if provided
    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        user[key] = userData[key];
      }
    }

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE user by ID
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
