import TokenBlacklist from "../entities/TokenBlackList";

export default class TokenBlacklistRepository {
  async add(token: string): Promise<void> {
    const blacklist = new TokenBlacklist();
    blacklist.token = token;
    await blacklist.save();
  }

  async exists(token: string): Promise<boolean> {
    const count = await TokenBlacklist.count({
      where: { token }
    });
    return count > 0;
  }
}
