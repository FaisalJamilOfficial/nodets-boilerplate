// module imports
import { isValidObjectId } from "mongoose";

// file imports
import ElementModel from "./model";
import { Element } from "./interface";
import { GetElementsDTO } from "./dto";

// destructuring assignments

// variable initializations

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addElement = async (elementObj: Element) => {
  return await ElementModel.create(elementObj);
};

/**
 * @description Update element data
 * @param {String} element element id
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updateElementById = async (
  element: string,
  elementObj: Partial<Element>
) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const elementExists = await ElementModel.findByIdAndUpdate(
    element,
    elementObj,
    { new: true }
  );
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Update element data
 * @param {Object} query element data
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updateElement = async (
  query: Partial<Element>,
  elementObj: Partial<Element>
) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await ElementModel.findOneAndUpdate(query, elementObj, {
    new: true,
  });
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const deleteElementById = async (element: string) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const elementExists = await ElementModel.findByIdAndDelete(element);
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} query element data
 * @returns {Object} element data
 */
export const deleteElement = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await ElementModel.findOneAndDelete(query);
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Get element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const getElementById = async (element: string) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const elementExists = await ElementModel.findById(element).select(
    "-createdAt -updatedAt -__v"
  );
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Get element
 * @param {Object} query element data
 * @returns {Object} element data
 */
export const getElement = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await ElementModel.findOne(query).select(
    "-createdAt -updatedAt -__v"
  );
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Get elements
 * @param {Object} params elements fetching parameters
 * @returns {Object[]} elements data
 */
export const getElements = async (params: GetElementsDTO) => {
  let { limit, page } = params;
  page = page - 1 || 0;
  limit = limit || 10;
  const query: any = {};
  const [result] = await ElementModel.aggregate([
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
 * @description Check element existence
 * @param {Object} query element data
 * @returns {Boolean} element existence status
 */
export const checkElementExistence = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await ElementModel.exists(query);
};

/**
 * @description Count elements
 * @param {Object} query element data
 * @returns {Number} elements count
 */
export const countElements = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await ElementModel.countDocuments(query);
};
