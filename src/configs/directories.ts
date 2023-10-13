// module imports
import path from "path";

// variable initializations
const __basedir = path.dirname(__dirname).toString().replace("configs", "");

export default {
  PUBLIC_DIRECTORY: __basedir + "/public/",
};
