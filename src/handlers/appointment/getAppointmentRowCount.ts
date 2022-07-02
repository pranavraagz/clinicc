import { Request, Response } from "express";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getAppointmentRowCount(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("appointment");

  if (!permission.granted) {
    return res.sendStatus(403);
  }

  const result = await AppDataSource.manager.getRepository(Appointment).count();

  res.status(200).json(result);
}
