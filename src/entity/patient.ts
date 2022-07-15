import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./appointment";
import { capitalize } from "lodash";

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
  @Column("varchar", { nullable: true })
  address: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @BeforeInsert()
  formatName() {
    // Trim trailing spaces
    this.name = this.name.trim();

    // Capitalize first letters
    this.name = this.name
      .split(" ")
      .map((e: string) => {
        return capitalize(e);
      })
      .join(" ");
  }
}
