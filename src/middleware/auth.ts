import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";

dotenv.config();

// Auth uses Json Web Tokens (JWT)

/**
 * authenticateJWT is used to add a key-value pair
 * into the Request.body
 */
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader = req.header("Authorization"); // Bearer Token
  if (!tokenHeader) {
    res.status(400).send({
      message: "jwt token absent, Access denied",
    });
    return;
  }

  try {
    const token = tokenHeader.split(" ")[1];
    const secret: string = process.env.JWT_SECRET!;
    try {
      var payload = jwt.verify(token, secret);
      /**
       * if payload is string, payload.id is invalid
       * so we need to assure TypeScript that it is not a string
       */
      if (typeof payload == "string") {
        throw new Error("Payload from jwt is string");
      }
    } catch (error) {
      res.status(500).json(error);
      return;
    }

    req.user = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch (error) {
    res.status(500).send({
      message: "Token is invalid",
    });
  }
};
