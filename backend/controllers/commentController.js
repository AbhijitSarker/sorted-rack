// controllers/commentController.js
const Comment = require("../models/commnt");
const Ticket = require("../models/ticket");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermission = require("../utility/checkPermission");

const createComment = async (req, res) => {
    const { content, ticketId } = req.body;
    if (!content || !ticketId) {
        throw new CustomError.BadRequestError("Please provide all required fields");
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
    }

    const comment = await Comment.create({
        content,
        ticket: ticketId,
        createdBy: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({ comment });
};

const getTicketComments = async (req, res) => {
    const { ticketId } = req.params;
    const comments = await Comment.find({ ticket: ticketId }).populate("createdBy", "email fname lname userName");
    res.status(StatusCodes.OK).json({ comments, count: comments.length });
};

const updateComment = async (req, res) => {
    const { id: commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new CustomError.NotFoundError(`No comment found with id ${commentId}`);
    }

    checkPermission(req.user, comment.createdBy);

    comment.content = content;
    await comment.save();

    res.status(StatusCodes.OK).json({ comment });
};

const deleteComment = async (req, res) => {
    const { id: commentId } = req.params;

    const comment = await Comment.findOneAndDelete(commentId);
    if (!comment) {
        throw new CustomError.NotFoundError(`No comment found with id ${commentId}`);
    }

    checkPermission(req.user, comment.createdBy);

    res.status(StatusCodes.OK).json({ msg: "Comment removed" });
};

module.exports = {
    createComment,
    getTicketComments,
    updateComment,
    deleteComment,
};