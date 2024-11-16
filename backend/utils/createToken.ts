import { Response } from "express";
import jwt from "jsonwebtoken";

// Define the function type
const generateToken = (res: Response, userId: string): string => {
  // Generate the JWT token with userId payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });

  // Set the JWT as an HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure flag in production
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });

  return token;
};

export default generateToken;
