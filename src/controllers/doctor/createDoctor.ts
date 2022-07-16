import { Doctor } from "../../entity/doctor";
import { User } from "../../entity/user";
import { AppDataSource } from "../../service/data-source";

export async function createDoctor(userId: number) {
  try {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      relations: { doctor: true },
    });

    console.log(user);

    if (user == null) {
      throw new Error("User not found");
    }
    if (user.doctor) {
      throw new Error("This user is already linked to a doctor account");
    }
    if (user.role !== "doctor") {
      throw new Error(
        "User does have have doctor role and therefore cannot be used to create a doctor"
      );
    }

    const doctor = new Doctor();

    doctor.user = user;

    await AppDataSource.getRepository(Doctor).save(doctor);
    return;
  } catch (error) {
    throw error;
  }
}
