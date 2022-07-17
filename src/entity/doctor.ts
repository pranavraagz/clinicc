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

  @Column({ type: "json", nullable: true, default: {} })
  availability: string;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToOne(() => User, (user) => user.doctor, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  setAvailability(avail: Availability) {
    this.availability = JSON.stringify(avail);
  }

  getAvailability(): Availability {
    return JSON.parse(this.availability);
  }
}

const s = new Doctor();

s.setAvailability({
  monday: [{ start: 0, end: 60 }],
  tuesday: [{ start: 0, end: 60 }],
  wednesday: [{ start: 0, end: 60 }],
  thursday: [{ start: 0, end: 60 }],
  friday: [{ start: 0, end: 60 }],
  saturday: [{ start: 0, end: 60 }],
  sunday: [{ start: 0, end: 60 }],
});
