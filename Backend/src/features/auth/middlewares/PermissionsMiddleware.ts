import type { NextFunction, Response } from "express";
import CustomError from "../../common/errors/CustomError";
import type { CustomRequestType } from "../../common/types/CustomRequestType";
import type PermissionEnum from "../enums/PermissionsEnum";

export default class PermissionsMiddleware {
  static checkPermissions(requiredPermissions: PermissionEnum[]) {
    return (req: CustomRequestType, res: Response, next: NextFunction) => {
      try {
        const user = req.user;

        if (!user) {
          throw new CustomError(
            "You don't have permissions to access this resource",
            "403",
            {},
            403
          );
        }

        const hasPermissions = requiredPermissions.some((permission) => {
          return user.role.permissions.includes(permission);
        });

        if (!hasPermissions) {
          throw new CustomError(
            "Your permissions are insufficient",
            "403",
            {},
            403
          );
        }

        next();
      } catch (error) {
        if (error instanceof CustomError) {
          res.status(error.status || 401).json({ error: error.message });
        } else {
          console.log("error");
          console.log(error);
          res
            .status(401)
            .json({ error: "Unauthorized: Your permissions are insufficient" });
        }
      }
    };
  }
}
