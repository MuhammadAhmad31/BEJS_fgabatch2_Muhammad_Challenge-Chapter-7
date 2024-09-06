import { Router } from "express";
import {
  googleAuth,
  login,
  logout,
  forgotPassword,
  resetPassword,
  register,
} from "../../../controllers/auth/auth.controller.js";
import passport from "../../../config/passport.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);  

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  googleAuth
);

router.get("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
