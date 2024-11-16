import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

function checkId(req: Request, res: Response, next: NextFunction) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid Object ID: ${req.params.id}`);
  }
  next();
}

export default checkId;
