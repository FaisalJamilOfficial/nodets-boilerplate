// module imports
import express from "express";

// file imports
import admins from "./admins";
import auth from "./auth";
import messages from "./messages";
import users from "./users";

// destructuring assignments
const { POSTMAN_URL } = process.env;

// variable initializations
const router = express.Router();

router.use("/admins", admins);
router.use("/auth", auth);
router.use("/messages", messages);
router.use("/users", users);

router.use("/docs", (_req, res) => res.redirect(POSTMAN_URL ?? ""));

export default router;
