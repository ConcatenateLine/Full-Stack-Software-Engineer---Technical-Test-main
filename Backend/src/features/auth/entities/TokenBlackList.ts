import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";

@Entity("token_blacklist")
export default class TokenBlacklist extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 255 })
  token!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;
}
