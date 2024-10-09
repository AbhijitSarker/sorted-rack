// routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
    createComment,
    getTicketComments,
    updateComment,
    deleteComment
} = require("../controllers/commentController");

router.post('/', authenticateUser, createComment);
router.get('/ticket/:ticketId', authenticateUser, getTicketComments);
router.patch('/:id', authenticateUser, updateComment);
router.delete('/:id', authenticateUser, deleteComment);

module.exports = router;