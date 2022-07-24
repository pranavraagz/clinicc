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

    secret = process.env.JWT_SECRET ?? "secret";
    expiresInSecs = parseInt(process.env.JWT_EXPIRES_IN_SECS ?? "2592000");

    // request validation
    const { value, error } = Joi.object({
      phone: Joi.string().required(),
      password: Joi.string().required(),
    }).validate(req.body);
    if (error) return res.status(400).send(error.message);

    const { phone, password } = value;

    let userRepo = await AppDataSource.getRepository(User);
    var user = await userRepo.findOneBy({ phone: phone });
    if (!user) return res.status(404).send("User account does not exist");

    // validate
    if ((await user.validatePassword(password)) === false) {
      return res.status(403).send("Incorrect password");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: expiresInSecs,
    });

    res.status(200).send({
      id: user.id,
      name: user.name,
      phone: user.phone,
      tokenType: "Bearer",
      expiresAt: addSeconds(Date.now(), expiresInSecs).toISOString(),
      jwt: token,
      role: user.role,
    });
    logger.info(`${user.name} has logged in`);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
