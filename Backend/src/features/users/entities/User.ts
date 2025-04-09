import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Unique,
  Entity,
  ManyToOne,
} from "typeorm";
import type { Address } from "../../common/valueObjects/Address";
import PasswordHasher from "../../common/utils/PasswordHasher";
import { Expose } from "class-transformer";
import Role from "../../auth/entities/Role";

@Entity()
@Unique(["email"])
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 100 })
  firstName!: string;

  @Column("varchar", { length: 100 })
  lastName!: string;

  @Column("varchar", { length: 100 })
  email!: string;

  @Column("varchar", { length: 100 })
  phoneNumber!: string;

  @Column("varchar", { length: 100, select: false })
  password!: string;

  @Column("varchar", {
    default: "Inactive",
  })
  status!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column({ type: "json", nullable: true })
  address!: Address;

  @Column("varchar", { nullable: true })
  avatar?: string;

  @ManyToOne(() => Role, (role) => role.users)
  role!: Role;

  async setPassword(password: string): Promise<void> {
    this.password = await PasswordHasher.hash(password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return PasswordHasher.compare(password, this.password);
  }

  @Expose()
  get avatarUrl(): string | null {
    const domain = process.env.DOMAIN || "/api";

    return this.avatar
      ? `${domain}/uploads/${this.avatar}`
      : `${domain}/assets/placeholders/avatarPlaceHolder.webp`;
  }
}
