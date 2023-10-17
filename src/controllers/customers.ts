// module imports
import { isValidObjectId } from "mongoose";

// file imports
import models from "../models";
import { Customer } from "../interfaces";
import { GetCustomersDTO } from "../dto/customers";

// destructuring assignments
const { customersModel } = models;

/**
 * @description Add customer
 * @param {String} user user id
 * @returns {Object} customer data
 */
export const addCustomer = async (customerObj: Customer) => {
  return await customersModel.create(customerObj);
};

/**
 * @description Update customer data
 * @param {String} user user id
 * @returns {Object} customer data
 */
export const updateCustomer = async (
  user: string,
  customerObj: Partial<Customer>
) => {
  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  const customerExists = await customersModel.findOneAndUpdate(
    { user },
    customerObj,
    { new: true }
  );
  if (!customerExists) throw new Error("Customer not found!|||404");
  return customerExists;
};

/**
 * @description Delete customer
 * @param {String} user user id
 * @returns {Object} customer data
 */
export const deleteCustomer = async (user: string) => {
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
export const getCustomer = async (user: string) => {
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
export const getCustomers = async (params: GetCustomersDTO) => {
  let { limit, page } = params;
  if (!limit) limit = 10;
  if (!page) page = 0;
  if (page) page = page - 1;
  const query: any = {};
  const [result] = await customersModel.aggregate([
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
