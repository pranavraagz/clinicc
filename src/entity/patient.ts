import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./appointment";

@Entity()
export class Patient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type: "date" })
  dob: string;
  @Column()
  sex: string;
  @Column()
  phone: string;
  @Column()
  altphone: string;
  @Column()
  email: string;
  @Column()
  height: number;
  @Column()
  weight: number;
  @Column()
  bp: string;
  @Column()
  address: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
