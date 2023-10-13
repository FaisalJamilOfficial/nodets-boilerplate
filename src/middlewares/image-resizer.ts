// module imports
import { Request, Response, NextFunction } from "express";

// file imports
import SharpManager from "../utils/sharp-manager";
import directories from "../configs/directories";
import { exceptionHandler } from "./exception-handler";
import { IRequest } from "../configs/types";

// destructuring assignments
const { PUBLIC_DIRECTORY } = directories;

export const resizeImages = exceptionHandler(
  async (req: IRequest, _res: Response, next: NextFunction) => {
    const images = req.files || [];
    const image = req.file || {};
    if (images || image) {
      const path = PUBLIC_DIRECTORY;

      // imagesData contains 1.image_name 2.image_path
      const imagesData = { images: images ?? [image], path };

      // req.files = await new SharpManager().resizeImagesWithThumbnails(
      //   imagesData
      // );
      next();
    } else next();
  }
);
