// file imports
import ElementModel from "./model";
import { UserToken } from "./interface";

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addElement = async (elementObj: UserToken) => {
  return await ElementModel.create(elementObj);
};

/**
 * @description Get element
 * @param {Object} query element data
 * @returns {Object} element data
 */
export const getElement = async (query: Partial<UserToken>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await ElementModel.findOne(query).select(
    "-createdAt -updatedAt -__v"
  );
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};
