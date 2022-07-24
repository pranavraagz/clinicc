import { Request, Response } from "express";
import Joi from "joi";
import { User } from "../../entity/user";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function updateUser(req: Request, res: Response) {
  try {
    // Permission check
    const permission = ac.can(req.user?.role).update("user");

    if (!permission.granted) {
      return res.sendStatus(403);
    }
    // request validation
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().optional(),
      phone: Joi.string().optional().length(10),
      password: Joi.string().optional(),
      role: Joi.string()
        .valid(...User.validRoles)
        .optional(),
    });
    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.message);
    const { id, name, phone, password, role } = value;

    // Ensure the ID corresponds to existing user
    const user = await AppDataSource.getRepository(User).findOneBy({ id: id });
    if (!user) return res.status(400).send("User does not exist");

    // If phone number is to be updated, ensure it is not being used by another account already
    if (phone) {
      const existingUserWithPhone = await AppDataSource.getRepository(
        User
      ).findOneBy({ phone: phone });

      if (existingUserWithPhone && existingUserWithPhone.id != id) {
        return res
          .status(400)
          .send("Phone number already in use by another user account");
      }
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (password) user.password = password;

    await user.save();

    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
