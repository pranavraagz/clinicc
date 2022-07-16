import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Doctor } from "./doctor";
import { Patient } from "./patient";

@Entity()
export class Appointment extends BaseEntity {
  static APPOINTMENT_DURATION_MINUTES = 10;
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "timestamptz" })
  startTime: Date;
  @Column({ type: "timestamptz" })
  endTime: Date;
  @Column({ type: "boolean", default: false })
  isAttended: boolean;
  @Column({ type: "boolean", default: false })
  isWalkIn: boolean;
  @Column("float4", { nullable: true })
  height: number;
  @Column("float4", { nullable: true })
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
}
