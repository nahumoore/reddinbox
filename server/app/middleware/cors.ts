import { NextFunction, Request, Response } from "express";

// CORS MIDDLEWARE
export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // SET CORS HEADERS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key"
  );

  // HANDLE PREFLIGHT REQUESTS
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
};
