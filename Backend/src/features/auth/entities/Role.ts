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

@Entity("roles")
export default class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 100 })
  name!: string;

  @Column("varchar", { length: 100 })
  label!: string;

  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
  })
  @ManyToMany(() => Permission)
  permissions!: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
