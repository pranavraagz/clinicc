import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Doctor } from "./doctor";
import { Patient } from "./patient";
import { User } from "./user";

@Entity()
export class Appointment extends BaseEntity {
  static APPOINTMENT_DURATION_MINUTES = 10;
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "datetime" })
  startTime: Date;
  @Column({ type: "datetime" })
  endTime: Date;
  @Column({ type: "boolean", default: false })
  isAttended: boolean;
  @Column({ type: "boolean", default: false })
  isPaid: boolean;
  @Column({ type: "boolean", default: false })
  isWalkIn: boolean;
  @Column("float", { nullable: true })
  height: number;
  @Column("float", { nullable: true })
  weight: number;
  @Column("varchar", { nullable: true })
  bp: string;

  // @Column("text", { array: true, default: [] })
  // prescription_images: string[]; // in seconds

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onDelete: "SET NULL",
  })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    onDelete: "SET NULL",
  })
  patient: Patient;

  @ManyToOne(() => User, (user) => user.gotPaymentFor, {
    onDelete: "SET NULL",
  })
  paidTo: User;
}
