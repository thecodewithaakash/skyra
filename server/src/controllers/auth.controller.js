import authModel from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/utils.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const isAlreadyExists = await authModel.findOne({ email });

    if (isAlreadyExists) {
      return res.status(409).json({
        message: "user already exists",
      });
    }

    const user = await authModel.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: role || "user",
    });

    const accessToken = createAccessToken({ id: user._id, role: user.role });
    const refreshToken = createRefreshToken({ id: user._id, role: user.role });

    await authModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found!",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = createAccessToken({ id: user._id, role: user.role });
    const refreshToken = createRefreshToken({ id: user._id, role: user.role });

    await authModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "user logged in successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to login user",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await authModel.findById(id);

    return res.status(200).json({
      message: "user info fetched successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get user info",
      error: error.message,
    });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "refreshToken not found!",
    });
  }

  let decodedToken;
  try {
    decodedToken = verifyRefreshToken(refreshToken);
  } catch {
    res.clearCookie("refreshToken", refreshCookieOptions);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }

  try {
    const user = await authModel.findById(decodedToken.id);

    if (!user || user.refreshToken !== refreshToken) {
      if (user) {
        user.refreshToken = null;
        await user.save();
      }

      res.clearCookie("refreshToken", refreshCookieOptions);
      return res.status(401).json({ message: "Refresh token is no longer valid" });
    }

    const accessToken = createAccessToken({ id: user._id, role: user.role });
    const newRefreshToken = createRefreshToken({
      id: user._id,
      role: user.role,
    });

    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Access token refreshed successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate new accessToken",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "refreshToken not found",
    });
  }

  try {
    const { id } = req.user;

    const user = await authModel.findById(id);

    await authModel.findByIdAndUpdate(user._id, {
      refreshToken: null,
    });

    res.clearCookie("refreshToken", refreshCookieOptions);

    return res.status(200).json({
      message: "user logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to logout the user",
      error: error.message,
    });
  }
};
