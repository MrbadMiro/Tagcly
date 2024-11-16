import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel.ts";
import asyncHandler from "./asyncHandler.ts";

// Extend the Request interface to include 'user' property
interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

// Authenticate middleware
const authenticate = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Attach user to the request (excluding the password)
      req.user = await User.findById(decoded.userId).select("-password");
      
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

// Authorize Admin middleware
const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

export { authenticate, authorizeAdmin };
