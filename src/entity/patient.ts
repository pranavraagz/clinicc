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
  @Column("varchar")
  name: string;
  @Column("date")
  dob: Date;
  // typeorm-specific, automatically mapped to string
  @Column("varchar")
  sex: string;
  @Column("varchar")
  phone: string;
  @Column("varchar", { nullable: true })
  altphone: string;
  @Column("varchar", { nullable: true })
  email: string;
  @Column("float4", { nullable: true })
  height: number;
  @Column("float4", { nullable: true })
  weight: number;
  @Column("varchar", { nullable: true })
  bp: string;
  @Column("varchar", { nullable: true })
  address: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
