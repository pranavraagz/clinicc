import { Request, Response } from "express";
import Joi from "joi";
import { Staff } from "../../entity/staff";
import { AppDataSource } from "../../service/data-source";
import * as jwt from "jsonwebtoken";

export async function loginStaff(req: Request, res: Response) {
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
    let staffRepo = await AppDataSource.getRepository(Staff);
    var staff = await staffRepo.findOneBy({ phone: phone });
    if (!staff) {
      res.status(404).send({
        msg: "Staff account does not exist",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }

  // validate
  if ((await staff.validatePassword(password)) === false) {
    res.status(400).send({
      message: "Incorrect password",
    });
    return;
  }

  const token = jwt.sign({ staff_id: staff.id }, secret, {
    expiresIn: expiresIn,
  });

  res.status(201).send({
    token_type: "Bearer",
    jwt: token,
  });
}
