import { Request, Response } from "express";
import Joi from "joi";
import { Staff } from "../../entity/staff";
import { AppDataSource } from "../../service/data-source";

export async function createStaff(req: Request, res: Response) {
  // request validation
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { value, error } = schema.validate(req.body);
  if (error != null) {
    res.status(400).json({
      error: error,
    });
    return;
  }
  const { name, phone, password } = value;

  // validate username unique-ness
  // try {
  //   var existingUser = await userRepo.findOne({ username: username });
  //   if (existingUser) {
  //     res.status(409).json({
  //       message: "userame already taken",
  //     });
  //     return;
  //   }
  // } catch (e) {
  //   res.status(500).json({ error: error });
  //   return;
  // }

  const staff = new Staff();
  staff.name = name;
  staff.password = password;
  staff.phone = phone;

  try {
    await AppDataSource.manager.save(staff);
  } catch (error) {
    res.sendStatus(500).json({ error: error });
    return;
  }

  res.sendStatus(201);
}
