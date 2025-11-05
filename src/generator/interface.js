// file imports
const { toPascalCase } = require("./helper.js");

/**
 * Generates the content for an interface file for a given module.
 * It creates a TypeScript interface using the module name.
 *
 * @param {string} moduleName - The name of the module for which interface content is generated.
 * @returns {string} The generated interface content as a string with a template placeholder.
 */
module.exports = function getInterfaceContent(moduleName) {
  const pascalCaseModuleName = toPascalCase(moduleName);
  return `
// file imports
import { MongoID } from "../../configs/types";

export interface ${pascalCaseModuleName} {
  _id?: MongoID;
  isDeleted?: boolean;
}
`;
};
