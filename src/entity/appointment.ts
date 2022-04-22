import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "./doctor";
import { Patient } from "./patient";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "timestamptz" })
  startTime: Date;

  @Column()
  duration: number; // in seconds

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;
}
