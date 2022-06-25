import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./appointment";

@Entity()
export class Doctor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  name: string;
  @Column("varchar", { nullable: true })
  phone: string;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
