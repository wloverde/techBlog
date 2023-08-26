const express = require('express');
const router = express.Router();
const { User, BlogPost, Comment } = require('../../models');

// GET all blog posts
router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll({
      include: [
        {
          model: User,
        },
        {
          model: Comment,
        },
      ],
    });
    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET blog post by ID
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const blogPost = await BlogPost.findByPk(postId, {
      include: [
        {
          model: User,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST create new blog post
router.post('/', async (req, res) => {
  const { title, description, user_id } = req.body;

  try {
    const newBlogPost = await BlogPost.create({
      title,
      description,
      user_id,
    });

    res.status(201).json(newBlogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT update blog post by ID
router.put('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, description } = req.body;

  try {
    const blogPost = await BlogPost.findByPk(postId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blogPost.title = title;
    blogPost.description = description;

    await blogPost.save();

    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE blog post by ID
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const blogPost = await BlogPost.findByPk(postId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await blogPost.destroy();

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;