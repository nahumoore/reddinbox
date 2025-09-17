import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

// AUTHENTICATION MIDDLEWARE
export const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // GET AUTH KEY FROM HEADERS
  const authKey = req.headers["authorization"]?.replace("Bearer ", "");

  // CHECK IF AUTH KEY IS PROVIDED
  if (!authKey) {
    res.status(401).json({
      success: false,
      error: "Authentication required",
      message:
        "Authentication required. Please provide API key in X-API-Key header or Authorization header.",
    });
    return;
  }

  // VALIDATE AUTH KEY
  if (authKey !== process.env.SERVER_API_KEY) {
    res.status(403).json({
      success: false,
      error: "Invalid API key",
      message: "Invalid API key",
    });
    return;
  }

  // SET AUTHENTICATED FLAG
  (req as any).isAuthenticated = true;
  next();
};
