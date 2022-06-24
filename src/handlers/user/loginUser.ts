import { Request, Response } from "express";
import Joi from "joi";
import { User } from "../../entity/user";
import { AppDataSource } from "../../service/data-source";
import * as jwt from "jsonwebtoken";

export async function loginUser(req: Request, res: Response) {
  // ensuring jwt secret is defined
  let secret: string;
  let expiresIn: string;
  try {
    secret = process.env.JWT_SECRET ?? "secret";
    expiresIn = process.env.JWT_EXPIRES_IN ?? "30d";
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
      res.status(404).send({
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
    res.status(400).send({
      message: "Incorrect password",
    });
    return;
  }

  const token = jwt.sign({ id: user.id }, secret, {
    expiresIn: expiresIn,
  });

  res.status(201).send({
    token_type: "Bearer",
    jwt: token,
  });
}
