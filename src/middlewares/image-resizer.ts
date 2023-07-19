// module imports
import express, { Request, Response, NextFunction } from "express";

// file imports
import SharpManager from "../utils/sharp-manager";
import directories from "../configs/directories";
import { exceptionHandler } from "./exception-handler";

// destructuring assignments
const { IMAGES_DIRECTORY } = directories;

export const resizeImages = exceptionHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { images } = req.files || {};
    if (images) {
      const path = IMAGES_DIRECTORY;

      // imagesData contains 1.image_name 2.image_path
      const imagesData = { images, path };

      // req.files.images = await new SharpManager().resizeImagesWithThumbnails(
      //   imagesData
      // );
      next();
    } else next();
  }
);
