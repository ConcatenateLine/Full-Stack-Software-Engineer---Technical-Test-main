import multer from "multer";

const memoryStorage = multer.memoryStorage();
const MAX_SIZE = 1 * 1024 * 1024; // 1MB

const MulterUploadMemory = multer({
  storage: memoryStorage,
  fileFilter: (_, file: Express.Multer.File, cb: Function) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
  },
  limits: {
    fileSize: MAX_SIZE,
  },
});

export default MulterUploadMemory;
