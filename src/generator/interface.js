// file imports
const { toPascalCase } = require("./helper.js");

module.exports = function getInterfaceContent(moduleName) {
  const pascalCaseModuleName = toPascalCase(moduleName);
  return `
// file imports
import { MongoID } from "../../configs/types";

export interface ${pascalCaseModuleName} {
  _id?: MongoID;
}
`;
};
