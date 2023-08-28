const router = require("express").Router();
const { User, BlogPost, Comment } = require("../models");

// GET home page - Display all blog posts and their associated data
router.get("/", async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: User, // Include the author of the blog post
          attributes: ["name"],
        },
        {
          model: Comment, // Include comments for each blog post
          attributes: ["comment", "date_created"], // Include the comment and date_created attributes
          include: [
            {
              model: User, // Include the commenter's information
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    const blogPosts = blogPostData.map(post => post.get({ plain: true }))

    res.render("home", { 
        blogPosts,
        logged_in: req.session.logged_in,
        user_id: req.session.user_id, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET login page
router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to home route
    if (req.session.logged_in) {
      res.redirect('/home');
      return;
    }
  
    res.render('login');
  });

// GET dashboard page
router.get("/dashboard", async (req, res) => {
  try {
    const user_id = req.session.user_id; // Get the logged-in user's ID from the session
    const blogPostData = await BlogPost.findAll({
      where: {
        user_id: user_id, // Fetch only the blog posts created by the logged-in user
      },
    });

    const blogPosts = blogPostData.map(post => post.get({ plain: true }));

    // Fetch the user's name using their user_id
    const userInstance = await User.findOne({
      where: {
        id: user_id,
      },
    });

    // Get the user's name
    const userName = userInstance.name;

    res.render("dashboard", {
      userName, // Pass the user's name
      blogPosts,
      logged_in: req.session.logged_in, // Pass the logged_in flag from the session
      user_id: user_id // Pass the user_id to the template
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
