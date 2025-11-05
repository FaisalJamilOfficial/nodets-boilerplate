// file imports
const { pluralize, toCamelCase, toPascalCase } = require("./helper.js");

/**
 * Generates the content for a controller file for a given module.
 * It constructs CRUD operations and other utility functions using the module name.
 *
 * @param {string} moduleName - The name of the module for which controller content is generated.
 * @returns {string} The generated controller content as a string with template placeholders.
 */
module.exports = function getControllerContent(moduleName) {
  const camelCaseModuleName = toCamelCase(moduleName);
  const pascalCaseModuleName = toPascalCase(moduleName);
  const pluralCamelCaseModuleName = pluralize(camelCaseModuleName);
  const pluralPascalCaseModuleName = pluralize(pascalCaseModuleName);
  return `
// module imports
import { isValidObjectId } from "mongoose";

// file imports
import ${pascalCaseModuleName}Model from "./model";
import { ${pascalCaseModuleName} } from "./interface";
import { Get${pluralPascalCaseModuleName}DTO } from "./dto";
import { MongoID } from "../../configs/types";
import { ErrorHandler } from "../../middlewares/error-handler";

// destructuring assignments

// variable initializations

/**
 * @description Add ${camelCaseModuleName}
 * @param {Object} ${camelCaseModuleName}Obj ${camelCaseModuleName} data
 * @returns {Object} ${camelCaseModuleName} data
 */
export const add${pascalCaseModuleName} = async (${camelCaseModuleName}Obj: ${pascalCaseModuleName}) => {
  return await ${pascalCaseModuleName}Model.create(${camelCaseModuleName}Obj);
};

/**
 * @description Add ${pluralCamelCaseModuleName}
 * @param {Object[]} ${pluralCamelCaseModuleName}Array ${pluralCamelCaseModuleName} data
 * @returns {Object} ${camelCaseModuleName} data
 */
export const add${pluralPascalCaseModuleName} = async (${pluralCamelCaseModuleName}Array: ${pascalCaseModuleName}[]) => {
  return await ${pascalCaseModuleName}Model.create(${pluralCamelCaseModuleName}Array);
};

/**
 * @description Update ${camelCaseModuleName} data
 * @param {string} ${camelCaseModuleName} ${camelCaseModuleName} id
 * @param {Object} ${camelCaseModuleName}Obj ${camelCaseModuleName} data
 * @returns {Object} ${camelCaseModuleName} data
 */
export const update${pascalCaseModuleName}ById = async (
  ${camelCaseModuleName}: MongoID,
  ${camelCaseModuleName}Obj: Partial<${pascalCaseModuleName}>
) => {
  if (!${camelCaseModuleName}) throw new ErrorHandler("Please enter ${camelCaseModuleName} id!", 400);
  if (!isValidObjectId(${camelCaseModuleName}))
    throw new ErrorHandler("Please enter valid ${camelCaseModuleName} id!", 400);
  const ${camelCaseModuleName}Exists = await ${pascalCaseModuleName}Model.findByIdAndUpdate(
    ${camelCaseModuleName},
    ${camelCaseModuleName}Obj,
    { new: true }
  );
  if (!${camelCaseModuleName}Exists) throw new ErrorHandler("${camelCaseModuleName} not found!", 404);
  return ${camelCaseModuleName}Exists;
};

/**
 * @description Update ${camelCaseModuleName} data
 * @param {Object} query ${camelCaseModuleName} data
 * @param {Object} ${camelCaseModuleName}Obj ${camelCaseModuleName} data
 * @returns {Object} ${camelCaseModuleName} data
 */
export const update${pascalCaseModuleName} = async (
  query: Partial<${pascalCaseModuleName}>,
  ${camelCaseModuleName}Obj: Partial<${pascalCaseModuleName}>
) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  const ${camelCaseModuleName}Exists = await ${pascalCaseModuleName}Model.findOneAndUpdate(query, ${camelCaseModuleName}Obj, {
    new: true,
  });
  if (!${camelCaseModuleName}Exists) throw new ErrorHandler("${camelCaseModuleName} not found!", 404);
  return ${camelCaseModuleName}Exists;
};

/**
 * @description Update ${pluralCamelCaseModuleName} data
 * @param {Object} query ${camelCaseModuleName} data
 * @param {Object} ${camelCaseModuleName}Obj ${camelCaseModuleName} data
 * @returns {Object} updating result data
 */
export const update${pluralPascalCaseModuleName} = async (
  query: Partial<${pascalCaseModuleName}>,
  ${camelCaseModuleName}Obj: Partial<${pascalCaseModuleName}>
) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  return await ${pascalCaseModuleName}Model.updateMany(query, ${camelCaseModuleName}Obj);
};

/**
 * @description Delete ${camelCaseModuleName}
 * @param {string} ${camelCaseModuleName} ${camelCaseModuleName} id
 * @returns {Object} ${camelCaseModuleName} data
 */
export const delete${pascalCaseModuleName}ById = async (${camelCaseModuleName}: MongoID) => {
  if (!${camelCaseModuleName}) throw new ErrorHandler("Please enter ${camelCaseModuleName} id!", 400);
  if (!isValidObjectId(${camelCaseModuleName}))
    throw new ErrorHandler("Please enter valid ${camelCaseModuleName} id!", 400);
  const ${camelCaseModuleName}Exists = await ${pascalCaseModuleName}Model.findByIdAndDelete(${camelCaseModuleName});
  if (!${camelCaseModuleName}Exists) throw new ErrorHandler("${camelCaseModuleName} not found!", 404);
  return ${camelCaseModuleName}Exists;
};

/**
 * @description Delete ${camelCaseModuleName}
 * @param {string} query ${camelCaseModuleName} data
 * @returns {Object} ${camelCaseModuleName} data
 */
export const delete${pascalCaseModuleName} = async (query: Partial<${pascalCaseModuleName}>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  const ${camelCaseModuleName}Exists = await ${pascalCaseModuleName}Model.findOneAndDelete(query);
  if (!${camelCaseModuleName}Exists) throw new ErrorHandler("${camelCaseModuleName} not found!", 404);
  return ${camelCaseModuleName}Exists;
};

/**
 * @description Delete ${pluralCamelCaseModuleName}
 * @param {string} query ${camelCaseModuleName} data
 * @returns {Object} deletion data
 */
export const delete${pluralPascalCaseModuleName} = async (query: Partial<${pascalCaseModuleName}>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  return await ${pascalCaseModuleName}Model.deleteMany(query);
};

/**
 * @description Get ${camelCaseModuleName}
 * @param {string} ${camelCaseModuleName} ${camelCaseModuleName} id
 * @returns {Object} ${camelCaseModuleName} data
 */
export const get${pascalCaseModuleName}ById = async (${camelCaseModuleName}: MongoID) => {
  if (!${camelCaseModuleName}) throw new ErrorHandler("Please enter ${camelCaseModuleName} id!", 400);
  if (!isValidObjectId(${camelCaseModuleName}))
    throw new ErrorHandler("Please enter valid ${camelCaseModuleName} id!", 400);
  const ${camelCaseModuleName}Exists = await ${pascalCaseModuleName}Model.findById(${camelCaseModuleName}).select(
    "-createdAt -updatedAt -__v"
  );
  if (!${camelCaseModuleName}Exists) throw new ErrorHandler("${camelCaseModuleName} not found!", 404);
  return ${camelCaseModuleName}Exists;
};

/**
 * @description Get ${camelCaseModuleName}
 * @param {Object} query ${camelCaseModuleName} data
 * @returns {Object} ${camelCaseModuleName} data
 */
export const get${pascalCaseModuleName} = async (query: Partial<${pascalCaseModuleName}>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  const ${camelCaseModuleName}Exists = await ${pascalCaseModuleName}Model.findOne(query).select(
    "-createdAt -updatedAt -__v"
  );
  if (!${camelCaseModuleName}Exists) throw new ErrorHandler("${camelCaseModuleName} not found!", 404);
  return ${camelCaseModuleName}Exists;
};

/**
 * @description Get ${pluralCamelCaseModuleName}
 * @param {Object} params ${pluralCamelCaseModuleName} fetching parameters
 * @returns {Object[]} ${pluralCamelCaseModuleName} data
 */
export const get${pluralPascalCaseModuleName} = async (params: Get${pluralPascalCaseModuleName}DTO) => {
  const { isDeleted } = params;
  let { limit, page } = params;
  page = page - 1 || 0;
  limit = limit || 10;
  const query: any = {};
  if (typeof isDeleted === "boolean") query.isDeleted = isDeleted;
  const [result] = await ${pascalCaseModuleName}Model.aggregate([
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
    {
      $facet: {
        totalCount: [{ $count: "totalCount" }],
        data: [{ $skip: page * limit }, { $limit: limit }],
      },
    },
    { $unwind: "$totalCount" },
    {
      $project: {
        totalCount: "$totalCount.totalCount",
        totalPages: { $ceil: { $divide: ["$totalCount.totalCount", limit] } },
        data: 1,
      },
    },
  ]);
  return { data: [], totalCount: 0, totalPages: 0, ...result };
};

/**
 * @description Check ${camelCaseModuleName} existence
 * @param {Object} query ${camelCaseModuleName} data
 * @returns {boolean} ${camelCaseModuleName} existence status
 */
export const check${pascalCaseModuleName}Existence = async (query: Partial<${pascalCaseModuleName}>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  return await ${pascalCaseModuleName}Model.exists(query);
};

/**
 * @description Count ${pluralCamelCaseModuleName}
 * @param {Object} query ${camelCaseModuleName} data
 * @returns {number} ${pluralCamelCaseModuleName} count
 */
export const count${pluralPascalCaseModuleName} = async (query: Partial<${pascalCaseModuleName}>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  return await ${pascalCaseModuleName}Model.countDocuments(query);
};  
`;
};
