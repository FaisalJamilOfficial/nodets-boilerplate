// file imports
import SharpManager from "../utils/sharp-manager.js";
import directories from "../configs/directories.js";
import { exceptionHandler } from "./exception-handler.js";

// destructuring assignments
const { IMAGES_DIRECTORY } = directories;

export const resizeImages = exceptionHandler(
  async (req: any, res: any, next: any) => {
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
