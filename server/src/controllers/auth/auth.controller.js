import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, findUserById, updateUserPassword, findUserByEmail, createUser } from "../../models/user.model.js";
import { JWT_SECRET } from "../../config/env.js";
import { sendResetPasswordEmail } from "../../config/mailer.js";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "../../utils/handleResponse.js";
import { io } from "../../index.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return handleErrorResponse(res, "Username and password are required.");
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) return handleErrorResponse(res, "Invalid username or password.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return handleErrorResponse(res, "Invalid username or password.");

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role?.name,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    handleSuccessResponse(res, "Login successful.", { token });
  } catch (error) {
    handleErrorResponse(res, "Login failed.");
  }
};

export const googleAuth = (req, res) => {
  if (req.user) {
    const token = jwt.sign(
      {
        id: req.user.id,
        username: req.user.username,
        name: req.user.displayName,
        role: "USER",
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    handleSuccessResponse(res, "Login successful.", { token });
  } else {
    handleErrorResponse(res, "Login failed.");
  }
};

export const logout = async (req, res) => {
  handleSuccessResponse(res, "Logout successful.");
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return handleErrorResponse(res, "Email is required.");
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) return handleErrorResponse(res, "User not found.");

    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    await sendResetPasswordEmail(email, resetToken);

    handleSuccessResponse(res, "Reset password link has been sent to your email.");
  } catch (error) {
    handleErrorResponse(res, error.message || "Failed to send reset password email.");
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return handleErrorResponse(res, "Token and new password are required.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) return handleErrorResponse(res, "Invalid or expired token.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(user.id, hashedPassword);

    io.emit("password-reset-success", {
      message: "Your password has been reset successfully.",
      userId: user.id,
    });

    handleSuccessResponse(res, "Password has been reset successfully.");
  } catch (error) {
    handleErrorResponse(res, "Failed to reset password.");
  }
};

export const register = async (req, res) => {
  const { username, email, password, name } = req.body;

  if (!username || !email || !password || !name) {
    return handleErrorResponse(res, "All fields are required.");
  }

  try {
    const existingUserByEmail = await findUserByEmail(email);
    const existingUserByUsername = await findUserByUsername(username);

    if (existingUserByEmail || existingUserByUsername) {
      return handleErrorResponse(res, "Email or username already taken.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
      name,
      roleName: 'USER',
    });

    io.emit("user-registered", {
      message: "Welcome to our platform!",
      userId: newUser.id,
      username: newUser.username,
    });

    handleSuccessResponse(res, "User registered successfully.", {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    handleErrorResponse(res, "Failed to register user.");
  }
};