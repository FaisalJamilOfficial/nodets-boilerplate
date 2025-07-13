// file imports
const { pluralize, toPascalCase } = require("./helper.js");

/**
 * Returns content for a DTO file, given a module name.
 * @param {string} moduleName Name of the module
 * @returns {string} Content for the DTO file
 */
module.exports = function getDTOContent(moduleName) {
  const pascalCaseModuleName = toPascalCase(moduleName);
  const pluralPascalCaseModuleName = pluralize(pascalCaseModuleName);
  return `
  // file imports
import { GetElementsDTO } from "../element/dto";

export interface Get${pluralPascalCaseModuleName}DTO extends GetElementsDTO {}
`;
};
