import Joi from "joi";
import { sys } from "typescript";
import { User } from "../entity/user";
import { AppDataSource } from "../service/data-source";

// Usage
// <command> <admin-phone> <admin-pass>

const main = async () => {
  if (process.argv[2] == undefined) {
    console.log("Admin phone number not provided");
    sys.exit(1);
  }
  if (process.argv[3] == undefined) {
    console.log("Admin password not provided");
    sys.exit(1);
  }

  const { value, error } = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().optional(),
  }).validate({
    phone: process.argv[2],
    password: process.argv[3],
    name: process.argv[4] ?? undefined,
  });

  if (error) {
    console.log(error);
    return;
  }

  const { phone, password, name } = value;
  const user = new User();
  user.role = "superadmin";
  user.phone = phone;
  user.password = password;
  user.name = name ?? "Superadmin";

  await AppDataSource.initialize();
  return await AppDataSource.manager.save(user);
};

main();
