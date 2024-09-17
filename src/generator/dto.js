// file imports
const { pluralize, toPascalCase } = require("./helper.js");

module.exports = function getDTOContent(moduleName) {
  const pascalCaseModuleName = toPascalCase(moduleName);
  const pluralPascalCaseModuleName = pluralize(pascalCaseModuleName);
  return `
  // file imports
import { GetElementsDTO } from "../element/dto";

export interface Get${pluralPascalCaseModuleName}DTO extends GetElementsDTO {}
`;
};
