import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./appointment";
import { User } from "./user";

interface IntervalMins {
  start: number;
  end: number;
}

export interface Availability {
  monday: Array<IntervalMins>;
  tuesday: Array<IntervalMins>;
  wednesday: Array<IntervalMins>;
  thursday: Array<IntervalMins>;
  friday: Array<IntervalMins>;
  saturday: Array<IntervalMins>;
  sunday: Array<IntervalMins>;
}

@Entity()
export class Doctor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "simple-json", nullable: true })
  availability: Availability;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToOne(() => User, (user) => user.doctor, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;
}
