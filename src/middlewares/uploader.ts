// module imports
import multer from "multer";
import { v4 } from "uuid";

export const upload = (directory: any) => {
  return multer({
    storage: multer.diskStorage({
      destination: function (_req, _file, cb) {
        cb(null, directory);
      },
      filename: function (_req, file, cb) {
        cb(null, v4() + file.originalname);
      },
    }),
  });
};

export const uploadTemporary = multer({ storage: multer.memoryStorage() });
