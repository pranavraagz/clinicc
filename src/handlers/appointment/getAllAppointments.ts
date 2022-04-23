import { Request, Response } from "express";
import { Appointment } from "../../entity/appointment";
import { AppDataSource } from "../../service/data-source";

export async function getAllAppointments(req: Request, res: Response) {
  const result = await AppDataSource.manager.getRepository(Appointment).find({
    relations: {
      patient: true,
      doctor: true,
    },
    select: {
      doctor: {
        id: true,
        name: true,
      },
      patient: {
        name: true,
        phone: true,
        altphone: true,
        id: true,
      },
    },
  });

  res.status(200).json(result);
}
