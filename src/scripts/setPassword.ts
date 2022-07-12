import Joi from "joi";
import { sys } from "typescript";
import { User } from "../entity/user";
import { AppDataSource } from "../service/data-source";

// Usage
// <command> <user-phone> <user-new-pass>

const main = async () => {
  if (process.argv[2] == undefined) {
    console.log("Phone number not provided");
    sys.exit(1);
  }
  if (process.argv[3] == undefined) {
    console.log("New password not provided");
    sys.exit(1);
  }

  const { value, error } = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
  }).validate({
    phone: process.argv[2],
    password: process.argv[3],
  });

  if (error) {
    console.log(error);
    return;
  }

  await AppDataSource.initialize();

  const { phone, password } = value;
  let user: User;
  try {
    user = await AppDataSource.getRepository(User).findOneOrFail({
      where: {
        phone: phone,
      },
    });
  } catch (error) {
    console.log(error);
    return;
  }
  console.log(user);
  user.password = password;

  await AppDataSource.manager.save(user);
  console.log(user);
  console.log("User password updated successfully!");
  return;
};

main();
