import sharp from "sharp";
import path from "path";
import type { NextFunction, Response } from "express";
import type { CustomRequestTypeWithFile } from "../../common/types/CustomRequestType";

const ImageResize = async (
  req: CustomRequestTypeWithFile,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next();
    }

    const processedImage = await sharp(req.file.buffer)
      .resize(300, 300, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    const filename = `${Date.now()}_${req.file.fieldname}.webp`;
    const filePath = path.join("uploads", filename);

    await sharp(processedImage).toFile(filePath);

    req.uploadedFile = {
      filename,
      path: filePath,
      contentType: "image/webp",
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default ImageResize;
