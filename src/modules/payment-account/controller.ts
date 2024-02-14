// module imports
import { isValidObjectId } from "mongoose";

// file imports
import PaymentAccountModel from "./model";
import * as userController from "../user/controller";
import { PaymentAccount } from "./interface";
import {
  GetPaymentAccountDTO,
  GetPaymentAccountsDTO,
} from "./dto";

// destructuring assignments

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addElement = async (elementObj: PaymentAccount) => {
  const { user } = elementObj;

  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  if (!(await userController.checkElementExistence({ _id: user })))
    throw new Error("user not found!|||404");
  return await PaymentAccountModel.create(elementObj);
};

/**
 * @description Update element data
 * @param {String} element element id
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updateElementById = async (
  element: string,
  elementObj: Partial<PaymentAccount>
) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const elementExists = await PaymentAccountModel.findByIdAndUpdate(
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
  query: Partial<PaymentAccount>,
  elementObj: Partial<PaymentAccount>
) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await PaymentAccountModel.findOneAndUpdate(
    query,
    elementObj,
    {
      new: true,
    }
  );
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
  const elementExists = await PaymentAccountModel.findByIdAndDelete(element);
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} query element data
 * @returns {Object} element data
 */
export const deleteElement = async (query: Partial<PaymentAccount>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await PaymentAccountModel.findOneAndDelete(query);
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
  const elementExists = await PaymentAccountModel.findById(element).select(
    "-createdAt -updatedAt -__v"
  );
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Get element
 * @param {Object} params element data
 * @returns {Object} element data
 */
export const getElement = async (params: GetPaymentAccountDTO) => {
  const { paymentAccount, user, key, value } = params;
  const query: any = {};
  if (paymentAccount) query._id = paymentAccount;
  if (user) query.user = user;
  if (key) query[key] = value;
  else query._id = null;
  const paymentAccountExists = await PaymentAccountModel.findOne(query).select(
    "-createdAt -updatedAt -__v"
  );
  // if (paymentAccountExists);
  // else throw new Error("PaymentAccount not found!|||404");
  return paymentAccountExists;
};

/**
 * @description Get elements
 * @param {Object} params elements fetching parameters
 * @returns {Object[]} elements data
 */
export const getElements = async (params: GetPaymentAccountsDTO) => {
  const { user } = params;
  let { limit, page } = params;
  page = page - 1 || 0;
  limit = limit || 10;
  const query: any = {};
  if (user) query.user = user;
  const [result] = await PaymentAccountModel.aggregate([
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
export const checkElementExistence = async (query: Partial<PaymentAccount>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await PaymentAccountModel.exists(query);
};

/**
 * @description Count elements
 * @param {Object} query element data
 * @returns {Number} elements count
 */
export const countElements = async (query: Partial<PaymentAccount>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await PaymentAccountModel.countDocuments(query);
};
