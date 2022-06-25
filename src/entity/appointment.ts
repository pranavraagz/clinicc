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
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "timestamptz" })
  startTime: Date;

  @Column("integer")
  duration: number; // in seconds

  // @Column("text", { array: true, default: [] })
  // prescription_images: string[]; // in seconds

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;
}
