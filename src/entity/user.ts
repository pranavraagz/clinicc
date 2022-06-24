import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./appointment";
import * as argon2 from "argon2";

type UserRole = "staff" | "admin" | "superadmin";

@Entity()
export class User {
  static validRoles = ["staff", "admin", "superadmin"];
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  phone: string;
  @Column()
  password: string;
  @Column()
  role: UserRole;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  async validatePassword(password: string) {
    return await argon2.verify(this.password, password);
  }
}
