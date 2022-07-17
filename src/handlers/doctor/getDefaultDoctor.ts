import { Request, Response } from "express";
import { Doctor } from "../../entity/doctor";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

const DEFAULT_DOCTOR_ID = 1;

export async function getDefaultDoctor(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("doctor");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const doctors = await AppDataSource.manager.getRepository(Doctor).find({
      relations: ["user"],
      select: {
        user: {
          name: true,
          id: true,
        },
        id: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        },
      },
      order: {
        id: "ASC",
      },
    });

    let doctor;
    if (doctors.length > 0) doctor = doctors[0];

    if (doctor) {
      res.status(200).send(doctor);
    } else {
      res.status(400).send("Doctor not found");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
