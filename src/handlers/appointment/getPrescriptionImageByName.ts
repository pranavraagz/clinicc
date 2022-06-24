// import { Request, Response } from "express";
// import Joi from "joi";
// import { Between } from "typeorm";
// import { Appointment } from "../../entity/appointment";
// import { AppDataSource } from "../../service/data-source";

// export async function getPrescriptionImageByName(req: Request, res: Response) {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//   });

//   const { value, error } = schema.validate(req.params);
//   if (error != null) {
//     console.log(error);
//     res.status(401).json({ error: error.message });
//   }

//   const { name } = value;

//   console.log(name);

//   // res.status(200).json();
//   const options = {
//     root: "./",
//     dotfiles: "deny",
//     headers: {
//       "x-timestamp": Date.now(),
//       "x-sent": true,
//     },
//   };
//   try {
//     res.sendFile("/prescriptions/" + name, options, function (err) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Sent image:", name);
//       }
//     });
//   } catch (error) {
//     res.status(400).json({ error: error });
//   }
// }
