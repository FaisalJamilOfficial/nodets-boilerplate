// module imports
import multer from "multer";
import { v4 } from "uuid";

// file imports
import { PUBLIC_DIRECTORY } from "../configs/directories";

export const upload = (directory = PUBLIC_DIRECTORY) => {
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
