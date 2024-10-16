const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  UpdateUser,
  UpdateUserRole,
  deleteAllUsers,
  UpdateUserPassword,
  getUserStats,
  getAdmins,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router
  .route("/")
  .get([authenticateUser, authorizeRoles("superadmin", "admin")], getAllUsers);

router
  .route("/deleteAllUsers")
  .delete(
    authenticateUser,
    authorizeRoles("superadmin", "admin"),
    deleteAllUsers
  );

router
  .route("/UpdateUserRole/:id")
  .patch(authenticateUser, authorizeRoles("superadmin"), UpdateUserRole);
router
  .route("/updateuser/:id")
  .patch(authenticateUser, authorizeRoles("superadmin", "admin"), UpdateUser);

router.route("/stats").get([authenticateUser, authorizeRoles("superadmin", "admin")], getUserStats)
router.route("/admins").get([authenticateUser, authorizeRoles("superadmin")], getAdmins)

// route pending yet
router.route("/UpdateUserPassword").patch(UpdateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
