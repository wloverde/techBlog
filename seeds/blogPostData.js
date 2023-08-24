const { BlogPost } = require('../models');
const blogPostData=[
    {
        "title": "my first post",
        "description": "definitely not a test post",
        "user_id": 1
    }
]
const seedBlogPost = () => BlogPost.bulkCreate(blogPostData);

module.exports = seedBlogPost;