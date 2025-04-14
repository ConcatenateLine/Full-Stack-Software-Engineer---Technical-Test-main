import Role from "../entities/Role";

export default class RoleRepository {
  async add(role: Role): Promise<void> {
    const newRole = new Role();
    newRole.name = role.name;
    newRole.label = role.label;
    await newRole.save();
  }

  async findByName(name: string): Promise<Role> {
    return Role.findOneOrFail({
      where: { name },
    });
  }

  async findAll(): Promise<Role[]> {
    return Role.find();
  }
}
