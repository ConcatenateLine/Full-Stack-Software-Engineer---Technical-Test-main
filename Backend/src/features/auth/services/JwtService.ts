import jwt from "jsonwebtoken";
import CustomError from "../../common/errors/CustomError";

export default class JwtService {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "your-secret-key";
  private static readonly JWT_EXPIRES_IN = 24 * 60 * 60;

  static sign(
    payload: Record<string, any>,
    expiresIn: number = JwtService.JWT_EXPIRES_IN
  ): string {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn });
  }
  static verify(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new CustomError("Invalid token");
    }
  }
  static decode(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new CustomError("Invalid token");
    }
  }
}
