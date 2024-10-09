const express = require("express");
const router = express.Router();


const {
    authenticateUser,
    authorizeRoles,
} = require("../middleware/authentication");
const { createTicket, getAllTickets, getCurrentUserTickets, getSingleTicket, updateTicket, deleteTicket, getTicketStats, getLatestTickets } = require("../controllers/ticketController");

router
    .route("/")
    .post(authenticateUser, createTicket)
    .get([authenticateUser, authorizeRoles("superadmin", "admin")], getAllTickets);
    
router.route("/myTickets").get(authenticateUser, getCurrentUserTickets);
router.route("/stats").get([authenticateUser, authorizeRoles("superadmin", "admin")], getTicketStats)
router.route('/latest').get(authenticateUser, getLatestTickets);

router
    .route("/:id")
    .get(authenticateUser, getSingleTicket)
    .patch([authenticateUser, authorizeRoles("superadmin", "admin")],  updateTicket)
    .delete([authenticateUser, authorizeRoles("superadmin", "admin")], deleteTicket);

module.exports = router;