import type { Response, NextFunction } from "express";
import multer from "multer";
import type { CustomRequestTypeWithFile } from "../../common/types/CustomRequestType";

const MulterErrorHanddlerMiddleware = (
  err: any,
  _req: CustomRequestTypeWithFile,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        res.status(400).json({
          error: "File size exceeded",
          code: "FILE_SIZE_EXCEEDED",
        });
        break;
      case "LIMIT_FILE_COUNT":
        res.status(400).json({
          error: "File count exceeded",
          code: "FILE_COUNT_EXCEEDED",
        });
        break;

      case "LIMIT_UNEXPECTED_FILE":
        res.status(400).json({
          error: "Unexpected file",
          code: "UNEXPECTED_FILE",
        });
        break;
      case "LIMIT_FIELD_KEY":
        res.status(400).json({
          error: "Field key too long",
          code: "FIELD_KEY_TOO_LONG",
        });
        break;
      default:
        res.status(400).json({
          error: "File processing error",
          code: "FILE_PROCESSING_ERROR",
        });
    }
  } else if (err?.code && err.code === "ENOENT") {
    res.status(500).json({
      error: "Don't have permission to write to the destination directory",
      code: "DIRECTORY_NOT_FOUND",
    });
  } else {
    next(err);
  }
};

export default MulterErrorHanddlerMiddleware;
