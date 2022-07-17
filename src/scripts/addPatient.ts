import { faker } from "@faker-js/faker";
import { sys } from "typescript";
import { Patient } from "../entity/patient";
import { AppDataSource } from "../service/data-source";

const addPatient = async () => {
  const patient = new Patient();
  patient.name = faker.name.findName();
  patient.dob = faker.date.birthdate();
  patient.phone = faker.phone.number("9#########");
  patient.sex = faker.name.gender(true);
  patient.address = faker.address.streetAddress();
  patient.altphone = faker.phone.number("9#########");
  patient.email = faker.internet.email();

  return await AppDataSource.manager.save(patient);
};

const main = async () => {
  await AppDataSource.initialize();
  if (process.argv[2] == undefined) {
    console.log("Provide number of patients to make");
    sys.exit(1);
  }
  const n = parseInt(process.argv[2]);
  let promises: Promise<Patient>[] = [];

  for (let i = 0; i < n; i++) {
    promises.push(addPatient());
  }
  await Promise.all(promises);
  console.log(`Added ${n} patients successfully.`);
  sys.exit(0);
};

main();
