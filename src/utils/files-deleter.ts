// module imports
import fs from "fs";

// file imports
import directories from "../configs/directories.js";

// destructuring assignments
const { IMAGES_DIRECTORY, ATTACHMENTS_DIRECTORY } = directories;

class FilesDeleter {
  fs: typeof fs;
  constructor() {
    this.fs = fs;
  }

  /**
   * @description Delete image file
   * @param {String} image image file name
   * @returns {null}
   */
  async deleteImage(params: any) {
    const { image } = params;
    const array = [];
    const PATH = IMAGES_DIRECTORY;
    array.push({ path: PATH + image });
    array.push({ path: PATH + "thumbnails/" + image });
    this.deleteFiles({ files: array });
    return { success: true };
  }

  /**
   * @description Delete attachment file
   * @param {String} attachment attachment file name
   * @returns {null}
   */
  async deleteAttachment(params: any) {
    const { attachment } = params;
    const array = [];
    const PATH = ATTACHMENTS_DIRECTORY;
    array.push({ path: PATH + attachment });
    this.deleteFiles({ files: array });
    return { success: true };
  }

  /**
   * @description Delete files from server
   * @param {[object]} files array of files
   * @returns {null}
   */
  async deleteFiles(params: any) {
    const { files } = params;
    if (files && Array.isArray(files)) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        try {
          fs.unlinkSync(element.path);
        } catch (error) {
          console.error(error);
        }
      }
    }
    return { success: true };
  }
}

export default FilesDeleter;
