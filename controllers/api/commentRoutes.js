const express = require('express');
const router = express.Router();
const { User, BlogPost, Comment } = require('../../models');

// GET all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: User,
        },
        {
          model: BlogPost,
        },
      ],
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET comment by ID
router.get('/:commentId', async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
        },
        {
          model: BlogPost,
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST create new comment
router.post('/blogpost/:blogpostId', async (req, res) => {
  const { comment, user_id } = req.body;
  const { blogpostId } = req.params;

  
  try {
    const blogPost = await BlogPost.findByPk(blogpostId);
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    const newComment = await Comment.create({
      comment,
      user_id: req.session.user_id,
      blogpost_id: blogpostId,
    });
    

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT update comment by ID
router.put('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { comment_text } = req.body;

  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.comment_text = comment_text;

    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE comment by ID
router.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;