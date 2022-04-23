import { Request, response, Response } from "express";
import { UploadedFile } from "express-fileupload";
import Joi from "joi";
import { Appointment } from "../../entity/appointment";
import { AppDataSource } from "../../service/data-source";

export async function addPrescriptionImageToAppointment(
  req: Request,
  res: Response
) {
  const { value, error } = Joi.object({
    id: Joi.number().required(),
  }).validate(req.body);

  if (error != null) {
    res.status(401).json({ error: error.message });
    return;
  }

  const { id } = value;

  if (req.files?.photo == null) {
    res.status(400).json({ msg: "photo field not included in request" });
    return;
  }

  const result = await AppDataSource.manager
    .getRepository(Appointment)
    .findOneBy({
      id: id,
    });

  if (result == null) {
    res.status(404).json({ msg: "Appointment not found based on ID" });
    return;
  }

  const photoFile = req.files?.photo as UploadedFile;

  const splitString = photoFile.name.split(".");
  const extension = splitString[splitString.length - 1];

  const newFileName = id + "_" + Date.now().toString() + "." + extension;
  const uploadPath = "./prescriptions/" + newFileName;

  photoFile.mv(uploadPath, async () => {
    result?.prescription_images.push(newFileName);
    await AppDataSource.manager.save(result);
  });

  res.sendStatus(201);
}
