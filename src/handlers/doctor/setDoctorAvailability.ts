import { Request, Response } from "express";
import Joi from "joi";
import { Doctor } from "../../entity/doctor";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function setDoctorAvailability(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).updateOwn("doctor");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const regex = new RegExp("^\\d\\d:\\d\\d$");
    const joiDay = Joi.array()
      .items(
        Joi.object({
          start: Joi.string().pattern(regex).required(),
          end: Joi.string().pattern(regex).required(),
        })
      )
      .required();
    const { value, error } = Joi.object({
      id: Joi.number().required(),
      availability: Joi.object({
        monday: joiDay,
        tuesday: joiDay,
        wednesday: joiDay,
        thursday: joiDay,
        friday: joiDay,
        saturday: joiDay,
        sunday: joiDay,
      }),
    }).validate(req.body);

    if (error) return res.status(400).send(error.message);

    const { id, availability } = value;

    const doctor = await AppDataSource.manager
      .getRepository(Doctor)
      .findOne({ relations: { user: true }, where: { id: parseInt(id) } });

    if (!doctor) return res.status(400).send("Doctor not found");

    if (doctor.user.id !== parseInt(<string>req.user?.id))
      return res
        .status(403)
        .send("Only the doctor can change their own availability");

    doctor.availability = availability;

    await doctor.save();
    return res.status(200).send("Success");
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
