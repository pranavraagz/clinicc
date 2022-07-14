import { Request, Response } from "express";
import Joi, { number } from "joi";
import { User } from "../../entity/user";
import { AppDataSource } from "../../service/data-source";
import * as jwt from "jsonwebtoken";
import { addSeconds } from "date-fns";
import { logger } from "../../service/logger";

export async function loginUser(req: Request, res: Response) {
  try {
    // ensuring jwt secret is defined
    let secret: string;
    let expiresInSecs: number;
    try {
      secret = process.env.JWT_SECRET ?? "secret";
      expiresInSecs = parseInt(process.env.JWT_EXPIRES_IN_SECS ?? "2592000");
    } catch (error) {
      res.status(500).send(error);
      return;
    }

    // request validation
    const { value, error } = Joi.object({
      phone: Joi.string().required(),
      password: Joi.string().required(),
    }).validate(req.body);
    if (error != null) {
      res.status(400).send(error);
      return;
    }

    const { phone, password } = value;

    try {
      let userRepo = await AppDataSource.getRepository(User);
      var user = await userRepo.findOneBy({ phone: phone });
      if (!user) {
        res.status(401).send({
          msg: "User account does not exist",
        });
        return;
      }
    } catch (error) {
      res.status(500).json({ error: error });
      return;
    }

    // validate
    if ((await user.validatePassword(password)) === false) {
      res.status(401).send({
        message: "Incorrect password",
      });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: expiresInSecs,
    });

    const expiresAt = Date.now();

    res.status(200).send({
      name: user.name,
      phone: user.phone,
      tokenType: "Bearer",
      expiresAt: addSeconds(Date.now(), expiresInSecs).toISOString(),
      jwt: token,
      role: user.role,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
