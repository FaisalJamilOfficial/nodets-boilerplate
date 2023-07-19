// module imports
import { isValidObjectId } from "mongoose";

// file imports
import models from "../models";

// destructuring assignments
const { usersModel, customersModel } = models;

/**
 * @description Add customer
 * @param {String} user user id
 * @returns {Object} customer data
 */
export const addCustomer = async (params: any) => {
  const { user } = params;
  const customerObj: any = {};

  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  if (await usersModel.exists({ _id: user })) customerObj.user = user;
  else throw new Error("user not found!|||404");

  return await customersModel.create(customerObj);
};

/**
 * @description Update customer data
 * @param {String} user user id
 * @returns {Object} customer data
 */
export const updateCustomer = async (params: any) => {
  const { user } = params;
  const customerObj: any = {};
  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  const customerExists = await customersModel.findOneAndUpdate(
    { user },
    customerObj,
    {
      new: true,
    }
  );
  if (!customerExists) throw new Error("Customer not found!|||404");
  return customerExists;
};

/**
 * @description Delete customer
 * @param {String} user user id
 * @returns {Object} customer data
 */
export const deleteCustomer = async (params: any) => {
  const { user } = params;
  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  const customerExists = await customersModel.findOneAndDelete({ user });
  if (!customerExists) throw new Error("Customer not found!|||404");
  return customerExists;
};

/**
 * @description Get customer
 * @param {String} user user id
 * @returns {Object} customer data
 */
export const getCustomer = async (params: any) => {
  const { user } = params;
  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  const customerExists = await customersModel
    .findOne({ user })
    .select("-createdAt -updatedAt -__v");
  if (!customerExists) throw new Error("Customer not found!|||404");
  return customerExists;
};

/**
 * @description Get customers
 * @param {String} keyword search keyword
 * @param {Number} limit customers limit
 * @param {Number} page customers page number
 * @returns {Object} customer data
 */
export const getCustomers = async (params: any) => {
  let { limit, page } = params;
  if (!limit) limit = 10;
  if (!page) page = 0;
  if (page) page = page - 1;
  const query: any = {};
  const customers = await customersModel.aggregate([
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
        totalPages: {
          $ceil: {
            $divide: ["$totalCount.totalCount", limit],
          },
        },
        data: 1,
      },
    },
  ]);
  return { data: [], totalCount: 0, totalPages: 0, ...customers[0] };
};
