import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../modules/user/user.service";
import { AppError } from "../../error/AppError";
import config from "../../config/config";

interface JwtPayload {
  userId: string;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Access token required", 401);
    }

    if (!config.jwt.jwt_secret) {
      throw new Error("JWT secret not defined");
    }

    const decoded = jwt.verify(token, config.jwt.jwt_secret) as JwtPayload;
    const user = await findUserById(decoded.userId);

    if (!user) {
      throw new AppError("User not found", 401);
    }
    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      if (!config.jwt.jwt_secret) {
        throw new Error("JWT secret not defined");
      }

      const decoded = jwt.verify(token, config.jwt.jwt_secret) as JwtPayload;
      const user = await findUserById(decoded.userId);
      if (user) {
        (req as any).user = user;
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};
