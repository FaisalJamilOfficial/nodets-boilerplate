// module imports
import { isValidObjectId } from "mongoose";

// file imports
import CustomerModel from "../models/customer";
import { Customer } from "../interfaces/customer";
import { GetCustomersDTO } from "../dto/customer";

// destructuring assignments

/**
 * @description Add customer
 * @param {Object} customerObj customer data
 * @returns {Object} customer data
 */
export const addCustomer = async (customerObj: Customer) => {
  return await CustomerModel.create(customerObj);
};

/**
 * @description Update customer data
 * @param {String} user user id
 * @param {Object} customerObj customer data
 * @returns {Object} customer data
 */
export const updateCustomer = async (
  user: string,
  customerObj: Partial<Customer>
) => {
  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  const customerExists = await CustomerModel.findOneAndUpdate(
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
  const customerExists = await CustomerModel.findOneAndDelete({ user });
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
  const customerExists = await CustomerModel.findOne({ user }).select(
    "-createdAt -updatedAt -__v"
  );
  if (!customerExists) throw new Error("Customer not found!|||404");
  return customerExists;
};

/**
 * @description Get customers
 * @param {Object} params customers fetching parameters
 * @returns {Object[]} customers data
 */
export const getCustomers = async (params: GetCustomersDTO) => {
  let { limit, page } = params;
  page = page - 1 || 0;
  limit = limit || 10;
  const query: any = {};
  const [result] = await CustomerModel.aggregate([
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
