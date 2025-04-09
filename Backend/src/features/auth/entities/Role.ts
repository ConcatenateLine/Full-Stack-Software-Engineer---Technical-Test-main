import {
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Entity,
  JoinTable,
  OneToMany,
} from "typeorm";
import User from "../../users/entities/User";
import Permission from "./Permission";
import { BaseEntity } from "typeorm";

@Entity()
export default class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 100 })
  name!: string;

  @Column("varchar", { length: 100 })
  label!: string;

  @JoinTable()
  @ManyToMany(() => Permission)
  permissions!: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
