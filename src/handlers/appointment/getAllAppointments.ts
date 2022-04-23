import { Request, Response } from "express";
import { Appointment } from "../../entity/appointment";
import { AppDataSource } from "../../service/data-source";

export async function getAllAppointments(req: Request, res: Response) {
  const result = await AppDataSource.manager.getRepository(Appointment).find();

  res.status(200).json(result);
}
