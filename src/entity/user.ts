import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./appointment";
import * as argon2 from "argon2";

type UserRole = "staff" | "doctor" | "admin";

@Entity()
export class User extends BaseEntity {
  static validRoles = ["staff", "doctor", "admin"];
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  name: string;
  @Column("varchar", { unique: true })
  phone: string;
  @Column("varchar")
  password: string;
  @Column("varchar")
  role: UserRole;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  async validatePassword(password: string) {
    return await argon2.verify(this.password, password);
  }
}
