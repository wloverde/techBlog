const { Comment } = require("../models");
const commentData = [
  {
    comment: "cool post",
    user_id: 1,
    blogpost_id: 1,
  },
];
const seedComment = () => Comment.bulkCreate(commentData);

module.exports = seedComment;