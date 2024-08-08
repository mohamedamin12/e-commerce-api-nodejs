const router = require("express").Router();
const upload = require("../middlewares/photoUpload");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadProfilePhoto,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserData,
  updateLoggedUserPassword,
  deleteLoggedUserData,
} = require("../controllers/user.controller");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validation/userValidator");

const authControllers = require("../controllers/auth.controller");

router.use(authControllers.protect);
router.get("/get-me", getLoggedUserData, getUser);
router.put("/update-me", updateLoggedUserValidator, updateLoggedUserData);
router.put("/change-my-password", updateLoggedUserPassword);
router.delete("/delete-me", deleteLoggedUserData);
router.post("/uploaded-profile-photo",upload.single("image"), uploadProfilePhoto);

router.use(
  authControllers.protect,
  authControllers.allowedTo("admin", "manager")
);

router
  .route("/change-password/:id")
  .put(changeUserPasswordValidator, changeUserPassword);

router.route("/").get(getUsers).post(createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
