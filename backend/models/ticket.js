const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Technical', 'Billing', 'Feature Request', 'Other']
    },
    priority: {
        type: String,
        required: true,
        enum: ['Normal', 'Medium', 'High', 'Urgent'],
        default: 'Normal'
    },
    status: {
        type: String,
        required: true,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;