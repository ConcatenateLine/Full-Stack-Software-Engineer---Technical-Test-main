import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { BaseEntity } from "typeorm";

@Entity()
export default class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 100 })
  name!: string;

  @Column("varchar", { length: 100 })
  label!: string;

  @Column("varchar", { length: 200 })
  description!: string;
}
