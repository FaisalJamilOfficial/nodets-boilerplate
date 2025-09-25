// file imports
const { pluralize, toCamelCase, toSnakeCase } = require("./helper.js");

/**
 * Generates the content for a Mongoose model file for a given module.
 * It constructs the model schema and exports it using the module name.
 *
 * @param {string} moduleName - The name of the module for which model content is generated.
 * @returns {string} The generated model content as a string with template placeholders.
 */
module.exports = function getModelContent(moduleName) {
  const camelCaseModuleName = toCamelCase(moduleName);
  const snakeCaseModuleName = toSnakeCase(moduleName);
  const pluralSnakeCaseModuleName = pluralize(snakeCaseModuleName);
  const pluralUpperCaseModuleName = pluralSnakeCaseModuleName.toUpperCase();
  return `
// module imports
import { model, Schema } from "mongoose";

// file imports
import { MODEL_NAMES } from "../../configs/enum";

// variable initializations

const ${camelCaseModuleName}Schema = new Schema(
  { title: { type: String } },
  { timestamps: true }
);

export default model(MODEL_NAMES.${pluralUpperCaseModuleName}, ${camelCaseModuleName}Schema);
`;
};
