// module imports
import { isValidObjectId } from "mongoose";

// file imports
import ElementModel from "../models/element";
import { Element } from "../interfaces/element";
import { GetElementsDTO } from "../dto/element";

// destructuring assignments

/**
 * @description Add element
 * @param {String} title element title
 * @returns {Object} element data
 */
export const addElement = async (ElementObj: Element) => {
  return await ElementModel.create(ElementObj);
};

/**
 * @description Update element data
 * @param {String} element element id
 * @returns {Object} element data
 */
export const updateElement = async (
  element: string,
  ElementObj: Partial<Element>
) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const ElementExists = await ElementModel.findOneAndUpdate(
    { element },
    ElementObj,
    { new: true }
  );
  if (!ElementExists) throw new Error("element not found!|||404");
  return ElementExists;
};

/**
 * @description Delete element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const deleteElement = async (element: string) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const ElementExists = await ElementModel.findOneAndDelete({ element });
  if (!ElementExists) throw new Error("element not found!|||404");
  return ElementExists;
};

/**
 * @description Get element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const getElement = async (element: string) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const ElementExists = await ElementModel.findOne({ element }).select(
    "-createdAt -updatedAt -__v"
  );
  if (!ElementExists) throw new Error("element not found!|||404");
  return ElementExists;
};

/**
 * @description Get Elements
 * @param {String} keyword search keyword
 * @param {Number} limit Elements limit
 * @param {Number} page Elements page number
 * @returns {Object} element data
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
