import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Unique,
  Entity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import type { Address } from "../../common/valueObjects/Address";
import PasswordHasher from "../../common/utils/PasswordHasher";
import { Expose } from "class-transformer";
import Role from "../../auth/entities/Role";

@Entity("users")
@Unique(["email"])
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 100, name: "first_name" })
  firstName!: string;

  @Column("varchar", { length: 100, name: "last_name" })
  lastName!: string;

  @Column("varchar", { length: 100 })
  email!: string;

  @Column("varchar", { length: 100, name: "phone_number" })
  phoneNumber!: string;

  @Column("varchar", { length: 100, name: "password", select: false })
  password!: string;

  @Column("varchar", {
    default: "Inactive",
  })
  status!: string;

  @CreateDateColumn({ name: "created_at", select: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", select: false })
  updatedAt!: Date;

  @Column({ type: "jsonb", name: "address", nullable: true })
  address!: Address;

  @Column("varchar", { name: "avatar", nullable: true })
  avatar?: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: "role_id" })
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
