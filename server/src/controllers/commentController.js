const dataStore = require('../models');

// GET all comments
const getAllComments = (req, res) => {
  res.status(200).json(dataStore.comments);
};

// GET comment by ID
const getCommentById = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  res.status(200).json(comment);
};

// POST create a new comment
const createComment = (req, res) => {
  const { content, userId, videoId } = req.body;

  // Basic validation
  if (!content || !userId || !videoId) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  // Check if user exists
  const userExists = dataStore.users.some(user => user.id === parseInt(userId));
  if (!userExists) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  // Check if video exists
  const videoExists = dataStore.videos.some(video => video.id === parseInt(videoId));
  if (!videoExists) {
    return res.status(400).json({ error: 'Video does not exist' });
  }

  const newComment = {
    id: dataStore.nextIds.comments++,
    content,
    userId: parseInt(userId),
    videoId: parseInt(videoId),
    createdAt: new Date().toISOString()
  };

  dataStore.comments.push(newComment);

  res.status(201).json(newComment);
};

// PUT update a comment
const updateComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const commentIndex = dataStore.comments.findIndex(c => c.id === commentId);

  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  const { content } = req.body;
  const comment = dataStore.comments[commentIndex];

  if (content) {
    comment.content = content;
  }

  comment.updatedAt = new Date().toISOString();

  res.status(200).json(comment);
};

// DELETE a comment
const deleteComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const commentIndex = dataStore.comments.findIndex(c => c.id === commentId);

  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  dataStore.comments.splice(commentIndex, 1);

  res.status(204).end();
};

// GET comments by video ID
const getCommentsByVideo = (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const video = dataStore.videos.find(v => v.id === videoId);

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const comments = dataStore.comments.filter(c => c.videoId === videoId);
  res.status(200).json(comments);
};

// GET comments by user ID
const getCommentsByUser = (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = dataStore.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const comments = dataStore.comments.filter(c => c.userId === userId);
  res.status(200).json(comments);
};

// POST like a comment
const likeComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const userIdInt = parseInt(userId);
  const comment = dataStore.comments.find(c => c.id === commentId);
  const user = dataStore.users.find(u => u.id === userIdInt);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Initialize likes array if not exists
  if (!comment.likes) {
    comment.likes = [];
  }

  // Check if already liked
  if (comment.likes.includes(userIdInt)) {
    return res.status(409).json({ error: 'User already liked this comment' });
  }

  // Add like
  comment.likes.push(userIdInt);

  res.status(201).json({ message: 'Comment liked successfully' });
};

// DELETE unlike a comment
const unlikeComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const userIdInt = parseInt(userId);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (!comment.likes) {
    return res.status(404).json({ error: 'No likes found for this comment' });
  }

  const likeIndex = comment.likes.indexOf(userIdInt);

  if (likeIndex === -1) {
    return res.status(404).json({ error: 'Like not found' });
  }

  // Remove like
  comment.likes.splice(likeIndex, 1);

  res.status(204).end();
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByVideo,
  getCommentsByUser,
  likeComment,
  unlikeComment
};